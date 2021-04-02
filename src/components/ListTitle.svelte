<script>
    import { tick, createEventDispatcher } from 'svelte'
    import { autoFocusout } from '~/actions/autoFocusout'
    import { lists } from '~/store/list.js'

    export let list;

    let isEditMode = false;
    let title = list.title;
    let textareaEl;

    //dispatch 컴퍼넌트 밖으로
    const dispatch = createEventDispatcher();

    function saveTitle(){
        if(title.trim()){
            //edit 커스텀 스토어
            lists.edit({
                listId: list.id,
                title: title
            })
        }
        offEditMode();
    }
    function removeList(){
        //remove 커스텀 스토어
        lists.remove({
            //listId 통해서 해당하는 list 를 검색하고 검색된 list 를 실제 데이터에서 삭제하는 기능을 추가
            listId: list.id
        })
        offEditMode();
    }
    async function onEditMode(){
        isEditMode = true;
        title = list.title;
        //edit 모드가 켜지면 커스텀이벤트 editMode에 데이터 true 보낸다.
        dispatch('editMode', true);
        await tick();
        textareaEl && textareaEl.focus();
    }
    function offEditMode(){
        isEditMode = false;
        //edit 모드가 켜지면 커스텀이벤트 editMode에 데이터 false 보낸다.
        dispatch('editMode', false);
    }
</script>

{#if isEditMode}
    <div use:autoFocusout={offEditMode} class="edit-mode">
        <textarea bind:value={title} bind:this={textareaEl} placeholder="Enter a title for this list..."
            on:keydown={(event)=>{
                event.key === 'Enter' && saveTitle()
                event.key === 'Escape'  && offEditMode();
                event.key === 'Esc'  && offEditMode();
            }}
        ></textarea>
        <div class="actions">
            <div class="btn success" on:click={saveTitle}>Save</div>
            <div class="btn" on:click={offEditMode}>Cancel</div>
            <div class="btn danger" on:click={removeList}>Delete List</div>
        </div>
    </div>
{:else}
    <h2 class="title">
        {list.title}
        <div class="btn small edit-btn-for-list" on:click={onEditMode}>
            Edit
        </div>
    </h2>

{/if}

<style lang="scss">
    h2.title{
      font-weight: 700;
      padding: 4px 8px;
      cursor: pointer;
      position: relative;
      .btn {
        display: none;
        position: absolute;
        right: 0;
        top: 0;
      }
    }
    :global(.list__inner:hover h2.title .edit-btn-for-list) {
      display: block;
    }
</style>