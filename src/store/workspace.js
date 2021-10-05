import router from '~/routes';

export default {
  namespaced: true,
  state() {
    return {
      workspaces: [],
      currentWorkspace: {},
      currentWorkspacePath: [],
    };
  },
  getters: {},
  mutations: {
    assignState(state, payload) {
      Object.keys(payload).forEach((key) => {
        state[key] = payload[key]; // 단순히 할당
      });
    },
  },
  actions: {
    async createWorkspace({ dispatch }, payload = {}) {
      // root 에 생성시 payload값이 undefined이므로 default값을 {}로 설정
      const { parentId } = payload;
      const workspace = await _request({
        method: 'POST',
        body: JSON.stringify({
          title: '',
          parent: parentId, // 없으면 undefined로 포함이 안됨!
        }),
      });
      console.log(workspace);
      await dispatch('readWorkspaces');
      // 생성 후 해당 문서로 이동
      router.push({
        name: 'Workspace',
        params: {
          id: workspace.id,
        },
      });
    },

    async readWorkspaces({ commit, dispatch }) {
      const workspaces = await _request({
        method: 'GET',
      });

      commit('assignState', {
        // workspaces: workspaces,
        workspaces,
      });
      dispatch('findWorkspacePath');

      // 최소 하나의 workspace는 남겨두기
      if (!workspaces.length) {
        dispatch('createWorkspace');
      }
    },

    async readWorkspace({ commit }, payload) {
      const { id } = payload;
      try {
        const workspace = await _request({
          id,
          method: 'GET',
        });
        commit('assignState', {
          currentWorkspace: workspace,
        });
      } catch (error) {
        router.push('/error');
      }
    },

    async updateWorkspace({ dispatch }, payload) {
      const { id, title, content } = payload;
      await _request({
        id,
        method: 'PUT',
        body: JSON.stringify({
          title,
          content,
        }),
      });
      dispatch('readWorkspaces');
    },

    async deleteWorkspace({ dispatch, state }, payload) {
      const { id } = payload;
      await _request({
        id,
        method: 'DELETE',
      });
      await dispatch('readWorkspaces');
      // 현재 보고있는 workspace 삭제 시 첫번째 문서로 이동
      if (id === parseInt(router.currentRoute.value.params.id, 10)) {
        router.push({
          name: 'Workspace',
          params: {
            id: state.workspaces[0].id,
          },
        });
      }
    },

    findWorkspacePath({ state, commit }) {
      const currentWorkspaceId = parseInt(
        router.currentRoute.value.params.id,
        10
      );
      function _find(workspace, parents) {
        if (currentWorkspaceId === workspace.id) {
          commit('assignState', {
            currentWorkspacePath: [...parents, workspace],
          });
        }
        if (workspace.documents) {
          workspace.documents.forEach((ws) =>
            _find(ws, [...parents, workspace])
          );
        }
      }
      state.workspaces.forEach((workspace) => _find(workspace, []));
    },
  },
};

async function _request(options) {
  const { id = '' } = options;
  return await fetch(`https://kdt.roto.codes/documents/${id}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-username': 'leon',
    },
  }).then((res) => res.json());
}
