// MCP server "studio" — cầu nối giữa các agent (Claude / Codex) và sổ sách của xưởng.
// STUDIO_ROLE=agent    : chỉ công cụ làm việc + ĐỀ XUẤT (Codex, subagent).
// STUDIO_ROLE=director : thêm công cụ quyết định (duyệt, mở/đóng phòng, đặt chỉ tiêu) — chỉ phiên của giám đốc.
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import * as S from './db.mjs';
import * as P from './pool.mjs';
import { formatOverview } from './format.mjs';

const ROLE = process.env.STUDIO_ROLE === 'director' ? 'director' : 'agent';
const server = new McpServer({ name: 'studio', version: '0.1.0' });

const text = (v) => ({ content: [{ type: 'text', text: typeof v === 'string' ? v : JSON.stringify(v, null, 2) }] });
const wrap = (fn) => async (args) => {
  try {
    return text(await fn(args ?? {}));
  } catch (e) {
    return { isError: true, content: [{ type: 'text', text: e instanceof S.StudioError ? e.message : `Lỗi nội bộ: ${e.message}` }] };
  }
};
const tool = (name, description, shape, fn) => server.registerTool(name, { description, inputSchema: shape }, wrap(fn));

const dept = z.string().describe('Mã phòng ban (slug), vd "sport"');
const teamId = z.number().int().describe('ID đội');
const videoId = z.string().describe('Mã video, vd "SPORT-T3-E01"');

// ===== Công cụ chung (mọi agent) =====
tool('studio_overview', 'Xem tổng quan xưởng: phòng ban, đội, ai đang làm gì, tiến độ hôm nay, tài khoản Claude/Codex (còn hay hết limit), hàng đợi việc nền, việc cần giám đốc chú ý.', { dept: dept.optional() }, ({ dept }) => formatOverview(S.overview({ dept }), P.poolOverview()));
tool('list_accounts', 'Xem các tài khoản Claude/Codex trong kho: của ai, còn dùng được không, hết limit đến khi nào (không có khoá/token).', {}, () => P.listAccounts().map(({ secret_file, home, ...a }) => a));
tool('list_jobs', 'Xem hàng đợi việc nền (ý tưởng→kế hoạch, sản xuất, QC, gỡ vướng): đang chạy/chờ hồi limit/cần người.', { status: z.enum(['queued', 'running', 'waiting_limit', 'succeeded', 'failed', 'needs_human', 'cancelled']).optional(), video_id: videoId.optional() }, (a) => P.listJobs(a).map(({ payload, ...j }) => j));
tool('list_topics', 'Liệt kê chủ đề của phòng: open = đã có, chưa giao đội · assigned = đã giao · proposed = đội đề xuất, CHỜ giám đốc duyệt · rejected = giám đốc từ chối.', { dept: dept.optional(), status: z.enum(['open', 'assigned', 'proposed', 'rejected']).optional() }, (a) => S.listTopics(a));
tool('list_videos', 'Liệt kê video theo phòng/đội/giai đoạn.', { dept: dept.optional(), stage: z.enum(S.STAGES).optional(), team_id: teamId.optional(), active_only: z.boolean().optional() }, (a) => S.listVideos(a));
tool('get_video', 'Chi tiết 1 video: đội phụ trách, chủ đề, thư mục làm việc và các file hiện có.', { video_id: videoId }, ({ video_id }) => S.getVideo(video_id));
tool('assign_topic', 'Giao chủ đề do giám đốc đưa hoặc duyệt cho một đội, tạo N video và thư mục. Suất/ngày chỉ giới hạn việc tự động, hết suất vẫn giao. Khi vượt suất, kết quả có over_capacity và nhật ký ghi vượt suất theo yêu cầu của giám đốc. Chủ đề đang chờ duyệt hoặc đã bị từ chối thì không thể giao.', { topic_id: z.number().int(), team_id: teamId.optional().describe('Bỏ trống = tự chọn đội còn nhiều suất nhất'), episodes: z.number().int().min(1).max(20).optional(), planned_for: z.string().optional().describe('YYYY-MM-DD, mặc định hôm nay') }, (a) => S.assignTopic({ ...a, by: 'agent' }));
tool('set_video_stage', 'Chuyển giai đoạn video: ideation → planning → production → review → ready → published (hoặc rejected).', { video_id: videoId, stage: z.enum(S.STAGES), note: z.string().optional() }, (a) => S.setVideoStage({ ...a, by: 'agent' }));
tool('report_status', 'BÁO CÁO trạng thái của bản thân để giám đốc thấy trên dashboard. Gọi khi bắt đầu việc (working + task), khi vướng (blocked), khi xong (idle).', { team_id: teamId, role: z.enum(S.ALL_ROLES).describe('Vị trí core của bạn: idea | script | visual | producer | qc | rescue | scout (tên vai cũ ideator_a…/planner/visual_director/support vẫn nhận, tự quy về core)'), status: z.enum(S.MEMBER_STATUS), task: z.string().optional().describe('Đang làm gì (ngắn gọn)'), video_id: videoId.optional() }, (a) => S.reportStatus(a));
tool('escalate', 'Xin Claude hỗ trợ khi việc quá khó/kẹt (đặt video vào trạng thái vướng, hiện cảnh báo trên dashboard).', { video_id: videoId, reason: z.string().describe('Vướng gì, đã thử gì'), role: z.enum(S.ALL_ROLES).optional() }, (a) => S.escalate(a));
tool('resolve_escalation', 'Đánh dấu đã gỡ vướng cho video.', { video_id: videoId, note: z.string().optional() }, (a) => S.resolveEscalation(a));
tool('propose_change', 'TRƯỞNG PHÒNG đề xuất thay đổi nhân sự: add_team (xin thêm đội) hoặc remove_team (giải thể đội dư). Đề xuất chỉ có hiệu lực SAU KHI giám đốc duyệt.', { dept, type: z.enum(S.PROPOSAL_TYPES), count: z.number().int().min(1).max(5).optional().describe('add_team: số đội xin thêm'), team_id: teamId.optional().describe('remove_team: đội cần giải thể'), reason: z.string().describe('Lý do cụ thể, có số liệu (chỉ tiêu, năng lực, tồn đọng)'), by: z.string().optional() }, (a) => S.proposeChange(a));
tool('list_proposals', 'Xem các đề xuất (mặc định tất cả; lọc theo status pending/approved/rejected).', { status: z.enum(['pending', 'approved', 'rejected']).optional(), dept: dept.optional() }, (a) => S.listProposals(a));
tool('log_event', 'Ghi 1 dòng nhật ký hoạt động (hiện ở dashboard).', { message: z.string(), dept: dept.optional(), team_id: teamId.optional(), video_id: videoId.optional(), actor: z.string().optional() }, (a) => (S.logEvent({ kind: 'note', ...a }), { ok: true }));

tool('propose_topic', 'Vị trí TÌM CHỦ ĐỀ ĐỀ XUẤT 1 chủ đề CHUNG CỦA PHÒNG (team_id chỉ để xác định phòng; chỉ khi phòng bật tự tìm chủ đề; khi giám đốc duyệt sẽ giao lần lượt cho các đội, ưu tiên đội chưa có việc). Phải nằm trong chủ đề chung của phòng, kèm lý do + nguồn. Chủ đề chỉ được làm SAU KHI giám đốc duyệt.', { team_id: teamId, text: z.string().describe('Chủ đề, 1 câu cụ thể'), reason: z.string().describe('Vì sao nên làm + nguồn (link) chứng minh đang được quan tâm'), brief: z.string().optional().describe('Gợi ý góc nhìn/đối tượng') }, (a) => S.proposeTopic({ ...a, by: 'agent' }));

// ===== Công cụ của giám đốc (chỉ khi STUDIO_ROLE=director) =====
if (ROLE === 'director') {
  tool('submit_topic', '[Giám đốc] Giao chủ đề mới cho một phòng.', { dept, text: z.string(), brief: z.string().optional().describe('Yêu cầu thêm: giọng điệu, đối tượng, cấm kỵ...') }, (a) => S.submitTopic({ ...a, by: 'director' }));
  tool('approve_proposal', '[Giám đốc] DUYỆT đề xuất nhân sự. Chỉ gọi khi giám đốc đã nói rõ đồng ý đề xuất đó.', { id: z.number().int(), note: z.string().optional() }, (a) => S.decideProposal({ ...a, approve: true, by: 'director' }));
  tool('reject_proposal', '[Giám đốc] TỪ CHỐI đề xuất nhân sự.', { id: z.number().int(), note: z.string().optional() }, (a) => S.decideProposal({ ...a, approve: false, by: 'director' }));
  tool('set_daily_target', '[Giám đốc] Đặt chỉ tiêu video/ngày cho phòng. Nếu vượt năng lực, trưởng phòng sẽ được yêu cầu rà soát và đề xuất thêm đội.', { dept, target: z.number().int().min(0).max(100) }, ({ dept, target }) => S.setDailyTarget({ slug: dept, target, by: 'director' }));
  tool('enqueue_job', '[Giám đốc] Xếp việc nền cho worker (tự chạy, tự chuyển tài khoản khi hết limit, tự chờ hồi limit). kind: plan (cần topic_id) | produce | qc | rescue (cần video_id) | dept_review (cần dept).', { kind: z.enum(Object.keys(P.JOB_KINDS)), topic_id: z.number().int().optional(), video_id: videoId.optional(), dept: dept.optional(), episodes: z.number().int().min(1).max(20).optional(), rounds: z.number().int().min(1).max(4).optional(), force: z.boolean().optional(), auto_produce: z.boolean().optional().describe('plan: true/false ghi đè cài đặt auto_produce. Không truyền → theo cài đặt (mặc định bật: kế hoạch xong tự sản xuất, không cần giám đốc duyệt kế hoạch)') }, (a) => ({ ...P.enqueueJob({ ...a, by: 'director' }), worker: P.ensureWorker() }));
  tool('approve_topic', '[Giám đốc] DUYỆT chủ đề do phòng đề xuất → thành chủ đề để làm, giao ngay cho đội đang rảnh nhất (lần lượt) và tự xếp việc kế hoạch. Chỉ gọi khi giám đốc nói rõ duyệt chủ đề đó.', { topic_id: z.number().int(), note: z.string().optional() }, (a) => {
    return { ...P.approveTopic({ ...a, by: 'director' }), worker: P.ensureWorker() }; // giao ngay cho đội đang rảnh nhất + xếp việc kế hoạch
  });
  tool('reject_topic', '[Giám đốc] TỪ CHỐI chủ đề do đội đề xuất.', { topic_id: z.number().int(), note: z.string().optional() }, (a) => S.decideTopic({ ...a, approve: false, by: 'director' }));
  tool('set_auto_topics', '[Giám đốc] BẬT/TẮT tự tìm chủ đề cho 1 phòng. TẮT = chỉ giám đốc đưa chủ đề. BẬT = mỗi đội tự tìm và ĐỀ XUẤT, giám đốc duyệt mới làm. Chỉ gọi khi giám đốc nói rõ.', { dept, on: z.boolean() }, (a) => S.setAutoTopics({ ...a, by: 'director' }));
  tool('cancel_job', '[Giám đốc] Huỷ việc nền.', { job_id: z.number().int() }, ({ job_id }) => P.cancelJob(job_id));
  tool('retry_job', '[Giám đốc] Chạy lại việc nền đã thất bại/cần người/đã huỷ.', { job_id: z.number().int() }, ({ job_id }) => P.retryJob(job_id));
  tool('approve_takeover', '[Giám đốc] DUYỆT cho AI khác làm thay việc nền đang kẹt ở AI bị limit/hỏng (hiện chỉ: by="claude" hoặc by="gemini" làm thay Codex ở việc kế hoạch "plan"; Gemini viết storyboard, Claude vẫn review và duyệt). by="off" thu hồi. Chỉ gọi khi giám đốc nói rõ duyệt cho việc đó và cho AI nào.', { job_id: z.number().int(), by: z.enum(['claude', 'gemini', 'off']), note: z.string().optional() }, ({ job_id, by, note }) => (by === 'off' ? P.revokeTakeover(job_id) : P.approveTakeover({ job_id, by, note })));
  tool('create_department', '[Giám đốc] Mở phòng ban mới.', { name: z.string(), slug: z.string().optional(), description: z.string().optional(), daily_target: z.number().int().min(0).max(100).optional(), initial_teams: z.number().int().min(0).max(10).optional() }, (a) => S.createDepartment({ ...a, by: 'director' }));
  tool('close_department', '[Giám đốc] Đóng phòng ban (giải thể toàn bộ đội). Từ chối nếu còn video đang làm, trừ khi force=true.', { dept, force: z.boolean().optional() }, ({ dept, force }) => S.closeDepartment({ slug: dept, force, by: 'director' }));
  tool('reopen_department', '[Giám đốc] Mở lại phòng đã đóng.', { dept, initial_teams: z.number().int().min(0).max(10).optional() }, ({ dept, initial_teams }) => S.reopenDepartment({ slug: dept, initial_teams, by: 'director' }));
}

await server.connect(new StdioServerTransport());
console.error(`[studio-mcp] sẵn sàng · vai trò=${ROLE} · db=${S.DB_PATH}`);
