<template>
  <nav>
    <div class="header">
      <div class="user-profile"></div>
      Minjeong's Notion
    </div>

    <ul>
      <WorkspaceItem
        v-for="workspace in workspaces"
        :key="workspace.id"
        :workspace="workspace" />
    </ul>

    <div class="actions">
      <div
        class="action"
        @click="$store.dispatch('workspace/createWorkspace')">
        <span class="material-icons">add</span>
        새로운 페이지
      </div>
    </div>
  </nav>
</template>

<script>
import WorkspaceItem from '~/components/WorkspaceItem';

export default {
  components: {
    WorkspaceItem
  },
  computed: {
    workspaces() {
      return this.$store.state.workspace.workspaces;
    }
  },
  created() { // 라이프사이클 비동기 미지원
    this.workspacesInit();
  },
  methods: {
    async workspacesInit() {
      await this.$store.dispatch('workspace/readWorkspaces');
      console.log(this.$store.state.workspace.currentWorkspacePath);
    }
  }
};
</script>

<style lang="scss" scoped>
nav {
  width: 240px;
  height: 100%;
  background-color: $color-background;
  display: flex;
  flex-direction: column;
  .header {
    padding: 14px;
    font-weight: 700;
    display: flex;  
    align-items: center;
    .user-profile {
      width: 20px;
      height: 20px;
      border-radius: 4px;
      margin-right: 10px;
      background-image: url("https://avatars.githubusercontent.com/u/80511900?v=4");
      background-size: cover;
    }
  }
  ul {
    flex-grow: 1;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .actions {
    height: 45px;
    display: flex;
    align-items: center;
    padding: 0 14px;
    color: $color-icon;
    cursor: pointer;
    &:hover {
      background-color: $color-background--hover1;
    }
    .material-icons {
      margin-right: 4px;
      color: $color-icon;
    }
  }
}
</style>