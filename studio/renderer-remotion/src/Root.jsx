import React from 'react';
import {Composition} from 'remotion';
import {CharacterScene} from './scenes/CharacterScene';
import {UiSimulationScene} from './scenes/UiSimulationScene';
import {ExplainerScene} from './scenes/ExplainerScene';
import {PromptReviewScene} from './scenes/PromptReviewScene';
import {QASequenceScene} from './scenes/QASequenceScene';
import {DataVizScene} from './scenes/DataVizScene';

const benchProps = {
	codeLines: ['def tinh_tong(gio_hang):', '    tong = 0', '    for mon in gio_hang:', '        tong += mon.gia', '    return tong'],
	errorText: 'TypeError: mon.gia khong xac dinh',
	basePose: 'desk_typing',
	reactPose: 'surprised',
	shots: [
		{atFrame: 0, shot: 'wide', focusX: 590, focusY: 880, movement: 'cut'},
		{atFrame: 90, shot: 1.9, focusX: 590, focusY: 880, movement: 'push_in', durationIn: 20},
	],
};

export const RemotionRoot = () => {
	return (
		<>
			{/* Composition "mo" cho Producer: nhan component_props tu storyboard.json qua --props, tu quyet durationInFrames theo do dai thuc te cua canh. */}
			<Composition
				id="DemoCharacter"
				component={CharacterScene}
				durationInFrames={300}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{poses: [{t: 0, id: 'welcome'}]}}
				calculateMetadata={({props}) => ({durationInFrames: props.durationInFrames || 300})}
			/>
			<Composition
				id="DemoUi"
				component={UiSimulationScene}
				durationInFrames={300}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{codeLines: []}}
				calculateMetadata={({props}) => ({durationInFrames: props.durationInFrames || 300})}
			/>
			<Composition
				id="DemoExplainer"
				component={ExplainerScene}
				durationInFrames={300}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{steps: []}}
				calculateMetadata={({props}) => ({durationInFrames: props.durationInFrames || 300})}
			/>
			<Composition
				id="DemoPrompt"
				component={PromptReviewScene}
				durationInFrames={300}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{promptText: ''}}
				calculateMetadata={({props}) => ({durationInFrames: props.durationInFrames || 300})}
			/>
			<Composition
				id="DemoQA"
				component={QASequenceScene}
				durationInFrames={300}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{beats: []}}
				calculateMetadata={({props}) => ({durationInFrames: props.durationInFrames || 300})}
			/>
			<Composition
				id="DemoDataViz"
				component={DataVizScene}
				durationInFrames={300}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{bars: []}}
				calculateMetadata={({props}) => ({durationInFrames: props.durationInFrames || 300})}
			/>
			<Composition id="Bench7s" component={UiSimulationScene} durationInFrames={210} fps={30} width={1080} height={1920} defaultProps={benchProps} />
			<Composition id="Bench30s" component={UiSimulationScene} durationInFrames={900} fps={30} width={1080} height={1920} defaultProps={benchProps} />
			<Composition id="Bench60s" component={UiSimulationScene} durationInFrames={1800} fps={30} width={1080} height={1920} defaultProps={benchProps} />
			<Composition
				id="SmokeCharacter"
				component={CharacterScene}
				durationInFrames={120}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{
					poses: [
						{t: 0, id: 'welcome'},
						{t: 40, id: 'think'},
						{t: 80, id: 'idea'},
					],
					textOverlay: {text: 'Day la Character Scene', from: 5, to: 35},
					shots: [{atFrame: 0, shot: 'medium', focusX: 540, focusY: 1100, movement: 'cut'}],
				}}
			/>
			<Composition
				id="SmokeUiSimulation"
				component={UiSimulationScene}
				durationInFrames={210}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{
					codeLines: ['def tinh_tong(gio_hang):', '    tong = 0', '    for mon in gio_hang:', '        tong += mon.gia', '    return tong'],
					errorText: 'TypeError: mon.gia khong xac dinh',
					basePose: 'desk_typing',
					reactPose: 'surprised',
					shots: [
						{atFrame: 0, shot: 'wide', focusX: 590, focusY: 880, movement: 'cut'},
						{atFrame: 90, shot: 1.9, focusX: 590, focusY: 880, movement: 'push_in', durationIn: 20},
					],
				}}
			/>
			<Composition
				id="SmokeExplainer"
				component={ExplainerScene}
				durationInFrames={150}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{
					steps: [
						{label: 'MUC TIEU', color: '#2F6FDE'},
						{label: 'DAU VAO', color: '#F28C28'},
						{label: 'DAU RA', color: '#2fae6b'},
					],
					stepInterval: 30,
					startFrame: 10,
					pose: 'point_right',
					pointFrames: [10, 40, 70],
					shots: [{atFrame: 0, shot: 'wide', focusX: 540, focusY: 900, movement: 'cut'}],
				}}
			/>
		</>
	);
};
