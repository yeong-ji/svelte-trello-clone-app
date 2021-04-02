<script>
  import { lists } from '~/store/list.js';
  import { tick } from 'svelte';
  import { autoFocusout } from "~/actions/autoFocusout";

  let isEditMode = false;
  let title = '';
  let textareaEl;


  function addList(){
   //만약 타이틀이 있으면 .trim을 이용해서 공백문자를 제거했는데도, lists.add 로 title를 추가한다.
   if (title.trim()) {
     lists.add({
      title: title
     })
   }
   offEditMode();
  }
  async function onEditMode(){
   isEditMode = true; //데이터가 갱신된다고 화면이 갱신되는 것이 아님
   await tick();  //비동기로 동작 [ 화면이 갱신되고 아래 코드가 실행 ]
   textareaEl && textareaEl.focus();
  }
  function offEditMode(){
   isEditMode = false;
   title = ''; //닫으면 초기화
  }
</script>

<div class="create-list">
{#if isEditMode}
 <div use:autoFocusout={offEditMode} class="edit-mode">
  <textarea bind:value={title} bind:this={textareaEl} placeholder="Enter a title for this list..."
   on:keydown={(event) => {
      //event의 key 값이 Enter이면 addList 함수를 실행한다.
      event.key === 'Enter' && addList();
      event.key === 'Escape' && offEditMode();
      event.key === 'Esc' && offEditMode();
   }}
  ></textarea>
  <div class="actions">
   <button class="btn success" on:click={addList}>Add List</button>
   <button class="btn" on:click={offEditMode}>Cancel</button>
  </div>
 </div>
{:else}
  <div class="add-another-list" on:click={onEditMode}>
   + Add another list
  </div>
{/if}
</div>

<style lang="scss">
    .create-list {
      white-space: normal;
      font-size: 16px;
      display: inline-block;
      width: 290px;
      padding: 10px 8px;
      vertical-align: top;
      background-color: rgba(#ebecf0, 0.6);
      border-radius: 4px;
      margin: 0 4px;
      line-height: 20px;
      cursor: pointer;
      transition:background-color .2s;
      &:hover {
        background-color:#ebecf0;
      }
    }
</style>