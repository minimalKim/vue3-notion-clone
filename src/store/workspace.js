import router from '~/routes';

export default {
  namespaced: true,
  state() {
    return {
      workspaces: [],
    };
  },
  getters: {},
  mutations: {
    assignState(state, payload) {
      Object.keys(payload).forEach((key) => {
        state[key] = payload[key]; // 단순히 할당
      });
      console.log(state);
    },
  },
  actions: {
    async createWorkspace({ dispatch }, payload = {}) {
      // root 에 생성시 payload값이 undefined이므로 default값을 {}로 설정
      const { parentId } = payload;
      const workspace = await fetch('https://kdt.roto.codes/documents/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-username': 'leon',
        },
        body: JSON.stringify({
          title: '',
          parent: parentId, // 없으면 undefined로 포함이 안됨!
        }),
      }).then((res) => res.json());
      await dispatch('readWorkspaces');
      // 생성 후 해당 문서로 이동
      router.push({
        name: 'Workspace',
        params: {
          id: workspace.id,
        },
      });
    },

    async readWorkspaces({ commit }) {
      const workspaces = await fetch('https://kdt.roto.codes/documents/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-username': 'leon',
        },
      }).then((res) => res.json());

      commit('assignState', {
        // workspaces: workspaces,
        workspaces,
      });
    },

    async readWorkspace({ commit }, payload) {
      const { id } = payload;
      const workspace = await fetch(`https://kdt.roto.codes/documents/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-username': 'leon',
        },
      }).then((res) => res.json());
      commit('assignState', {
        currentWorkspace: workspace,
      });
    },

    async updateWorkspace({ dispatch }, payload) {
      const { id, title, content } = payload;
      await fetch(`https://kdt.roto.codes/documents/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-username': 'leon',
        },
        body: JSON.stringify({
          title,
          content,
        }),
      }).then((res) => res.json());
      dispatch('readWorkspaces');
    },

    async deleteWorkspace({ dispatch }, payload) {
      const { id } = payload;
      await fetch(`https://kdt.roto.codes/documents/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-username': 'leon',
        },
      }).then((res) => res.json());
      await dispatch('readWorkspaces');
    },
  },
};
