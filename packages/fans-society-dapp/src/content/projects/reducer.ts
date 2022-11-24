import { ActionType, createReducer } from 'typesafe-actions';

import { SET_CURRENT_ACCOUNT } from 'src/eth-network/actions';

import {
	ADD_PROJECT_COMMITMENT,
	CLEAR_PROJECTS_TX_ERROR,
	COMMIT_ON_PROJECT,
	CREATE_PROJECT,
	GET_PROJECT,
	IProjectDetail,
	IProjectListCapabilities,
	IProjectListItem,
	IProjectsContractInfo,
	LIST_MY_PROJECT_COMMITMENTS,
	LIST_PROJECTS,
	LOAD_PROJECTS_CONTRACT_INFO,
	ProjectStatus,
	PROJECT_ADDED,
	PROJECT_STATUS_CHANGED,
	REMOVE_PROJECT_COMMITMENT,
	WITHDRAW_ON_PROJECT,
} from './actions';

export interface IProjectsState {
	contract: { info?: IProjectsContractInfo; loading: boolean };
	projects: {
		items: { [id: string]: IProjectListItem };
		$capabilities: IProjectListCapabilities;
		loading: boolean;
	};
	commitments: {
		items: { [id: string]: number };
		loading: boolean;
	};
	currentProject: { item?: IProjectDetail; loading: boolean };
	txPending: boolean;
	error?: string;
}

const initialState: IProjectsState = {
	contract: { loading: false },
	projects: { items: {}, $capabilities: {}, loading: false },
	commitments: { items: {}, loading: false },
	currentProject: { loading: false },
	txPending: false,
};

export default createReducer(initialState)
	.handleAction(
		[LOAD_PROJECTS_CONTRACT_INFO.request],
		(state: IProjectsState): IProjectsState => {
			return {
				...state,
				contract: {
					info: undefined,
					loading: true,
				},
			};
		},
	)

	.handleAction(
		[LOAD_PROJECTS_CONTRACT_INFO.failure],
		(
			state: IProjectsState,
			action: ActionType<typeof LOAD_PROJECTS_CONTRACT_INFO.failure>,
		): IProjectsState => {
			return {
				...state,
				contract: {
					...state.contract,
					loading: false,
				},
				error: action.payload,
			};
		},
	)

	.handleAction(
		[LOAD_PROJECTS_CONTRACT_INFO.success],
		(
			state: IProjectsState,
			action: ActionType<typeof LOAD_PROJECTS_CONTRACT_INFO.success>,
		): IProjectsState => {
			return {
				...state,
				contract: {
					info: action.payload,
					loading: false,
				},
			};
		},
	)

	.handleAction(
		[LIST_PROJECTS.request],
		(state: IProjectsState): IProjectsState => {
			return {
				...state,
				projects: {
					items: {},
					loading: true,
					$capabilities: {},
				},
			};
		},
	)

	.handleAction(
		[LIST_PROJECTS.failure],
		(
			state: IProjectsState,
			action: ActionType<typeof LIST_PROJECTS.failure>,
		): IProjectsState => {
			return {
				...state,
				projects: {
					...state.projects,
					loading: false,
				},
				error: action.payload,
			};
		},
	)

	.handleAction(
		[LIST_PROJECTS.success],
		(
			state: IProjectsState,
			action: ActionType<typeof LIST_PROJECTS.success>,
		): IProjectsState => {
			return {
				...state,
				projects: {
					...state.projects,
					items:
						action.payload.reduce((acc, p) => {
							acc[p.id] = p;
							return acc;
						}, {}) || {},
					loading: false,
					$capabilities: {
						$canCreate: state.contract.info?.isOwner,
					},
				},
			};
		},
	)

	.handleAction(
		[PROJECT_ADDED],
		(
			state: IProjectsState,
			action: ActionType<typeof PROJECT_ADDED>,
		): IProjectsState => {
			return {
				...state,
				projects: {
					...state.projects,
					items: {
						...state.projects.items,
						[action.payload.id]: action.payload,
					},
				},
			};
		},
	)

	.handleAction(
		[
			CREATE_PROJECT.request,
			COMMIT_ON_PROJECT.request,
			WITHDRAW_ON_PROJECT.request,
		],
		(state: IProjectsState): IProjectsState => {
			return {
				...state,
				txPending: true,
			};
		},
	)

	.handleAction(
		[
			CREATE_PROJECT.failure,
			COMMIT_ON_PROJECT.failure,
			WITHDRAW_ON_PROJECT.failure,
		],
		(
			state: IProjectsState,
			action: ActionType<typeof CREATE_PROJECT.failure>,
		): IProjectsState => {
			return {
				...state,
				txPending: false,
				error: action.payload,
			};
		},
	)

	.handleAction(
		[
			CREATE_PROJECT.success,
			COMMIT_ON_PROJECT.success,
			WITHDRAW_ON_PROJECT.success,
		],
		(state: IProjectsState): IProjectsState => {
			return {
				...state,
				txPending: false,
			};
		},
	)

	.handleAction(
		[GET_PROJECT.request],
		(state: IProjectsState): IProjectsState => {
			return {
				...state,
				currentProject: {
					item: undefined,
					loading: true,
				},
			};
		},
	)

	.handleAction(
		[GET_PROJECT.failure],
		(
			state: IProjectsState,
			action: ActionType<typeof GET_PROJECT.failure>,
		): IProjectsState => {
			return {
				...state,
				currentProject: {
					...state.currentProject,
					loading: false,
				},
				error: action.payload,
			};
		},
	)

	.handleAction(
		[GET_PROJECT.success],
		(
			state: IProjectsState,
			action: ActionType<typeof GET_PROJECT.success>,
		): IProjectsState => {
			return {
				...state,
				txPending: false,
				currentProject: {
					item: action.payload,
					loading: false,
				},
			};
		},
	)

	.handleAction(
		[LIST_MY_PROJECT_COMMITMENTS.request],
		(state: IProjectsState): IProjectsState => {
			return {
				...state,
				commitments: {
					items: {},
					loading: true,
				},
			};
		},
	)

	.handleAction(
		[LIST_MY_PROJECT_COMMITMENTS.failure],
		(
			state: IProjectsState,
			action: ActionType<typeof LIST_MY_PROJECT_COMMITMENTS.failure>,
		): IProjectsState => {
			return {
				...state,
				commitments: {
					...state.commitments,
					loading: false,
				},
				error: action.payload,
			};
		},
	)

	.handleAction(
		[LIST_MY_PROJECT_COMMITMENTS.success],
		(
			state: IProjectsState,
			action: ActionType<typeof LIST_MY_PROJECT_COMMITMENTS.success>,
		): IProjectsState => {
			return {
				...state,
				commitments: {
					...state.commitments,
					items: {
						...state.commitments.items,
						...action.payload,
					},
					loading: false,
				},
			};
		},
	)

	.handleAction(
		[ADD_PROJECT_COMMITMENT],
		(
			state: IProjectsState,
			action: ActionType<typeof ADD_PROJECT_COMMITMENT>,
		): IProjectsState => {
			return {
				...state,
				commitments: {
					...state.commitments,
					items: {
						...state.commitments.items,
						[action.payload.id]:
							(state.commitments.items[action.payload.id] || 0) +
							action.payload.amount,
					},
				},
			};
		},
	)

	.handleAction(
		[REMOVE_PROJECT_COMMITMENT],
		(
			state: IProjectsState,
			action: ActionType<typeof REMOVE_PROJECT_COMMITMENT>,
		): IProjectsState => {
			return {
				...state,
				commitments: {
					...state.commitments,
					items: {
						...state.commitments.items,
						[action.payload.id]:
							(state.commitments.items[action.payload.id] || 0) -
							action.payload.amount,
					},
				},
			};
		},
	)

	.handleAction(
		[PROJECT_STATUS_CHANGED],
		(
			state: IProjectsState,
			action: ActionType<typeof PROJECT_STATUS_CHANGED>,
		): IProjectsState => {
			let currentProject = state.currentProject;
			if (action.payload.id === state.currentProject.item?.id) {
				currentProject = {
					...state.currentProject,
					item: {
						...state.currentProject.item,
						$capabilities: {
							$canAbort:
								state.contract.info.isOwner &&
								action.payload.status < ProjectStatus.Launched,
						},
					},
				};
			}

			return {
				...state,
				currentProject,
				projects: {
					...state.projects,
					items: {
						...state.projects.items,
						[action.payload.id]: {
							...state.projects.items[action.payload.id],
							status: action.payload.status,
						},
					},
				},
			};
		},
	)

	.handleAction(
		[CLEAR_PROJECTS_TX_ERROR],
		(
			state: IProjectsState,
			action: ActionType<typeof CLEAR_PROJECTS_TX_ERROR>,
		): IProjectsState => {
			return {
				...state,
				error: undefined,
			};
		},
	)

	.handleAction(
		[SET_CURRENT_ACCOUNT],
		(
			state: IProjectsState,
			action: ActionType<typeof SET_CURRENT_ACCOUNT>,
		): IProjectsState => {
			// reset state will force reload of data
			return initialState;
		},
	);
