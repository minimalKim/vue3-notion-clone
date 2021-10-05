<template>
  <section>
    <div class="inner">
      <div
        ref="title"
        class="title"
        placeholder="제목 없음"
        contenteditable
        @input="onInput">
        {{ title }}
      </div>
      <div
        ref="content"
        class="content"
        placeholder="내용을 입력하세요"
        contenteditable
        @input="onInput"
        v-html="content">
      </div>
    </div>
  </section>
</template>

<script>
export default {
  computed: {
    title() {
      return this.$store.state.workspace.currentWorkspace.title;
    },
    content() {
      return this.$store.state.workspace.currentWorkspace.content;
    }
  },
  watch: {
    $route() {
      this.$store.dispatch('workspace/readWorkspace', {
      id: this.$route.params.id
    });
    }
  },
  created() { // 생성된 직후
    this.$store.dispatch('workspace/readWorkspace', {
      id: this.$route.params.id
    });
  },
  methods: {
    onInput() {
      if (!this.$refs.content.textContent.trim()) { // 내용삭제시 남아있는 <br> 삭제
        this.$refs.content.innerHTML = '';
      }
      this.$store.dispatch('workspace/updateWorkspace',{
        id: this.$route.params.id,
        title: this.$refs.title.textContent,
        content: this.$refs.content.innerHTML
      });
    }
  }
};
</script>

<style lang="scss" scoped>
section {
  padding: 100px 0 200px;
  .inner {
    max-width: 700px; 
    margin: 0 auto; // 축소시 중앙 정렬
    padding: 0 20px; 
  
    [contenteditable] {
      outline: none;
      cursor: text;
      &.title {
        font-size : 44px;
        font-weight: 700;
        margin-bottom: 20px;
      }
      &.content {
        font-size: 16px;
      }
      &:empty::before {
        content: attr(placeholder);
        color: rgba($color-font, .3);
      } 
    }

  }
}
</style>