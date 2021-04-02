<script>
    import { autoFocusout } from "../actions/autoFocusout";
    import {tick, createEventDispatcher, onDestroy } from "svelte";
    import { cards } from '~/store/list';


    export let listId;

    let isEditMode = false;
    let title = '';
    let textareaEl;

    const dispatch = createEventDispatcher();

    //카드 추가
    function addCard(){
        if(title.trim()){
            //카드가 추가되는 로직
            //cards라는 객체 데이터를 가져오고
            cards.add({
                //listId를 props로 받아서
                listId: listId,
                title: title
            })
        }
        offEditMode();
    }
    async function onEditMode(){
        isEditMode = true;
        dispatch('editMode', true)
        await tick();
        textareaEl && textareaEl.focus()
    }
    function offEditMode(){
        isEditMode = false;
        title = '';
        dispatch('editMode', false)
    }

    onDestroy(()=>{
        offEditMode();
    })
</script>

{#if isEditMode}
    <div use:autoFocusout={offEditMode} class="edit-mode">
        <textarea bind:value={title} bind:this={textareaEl} placeholder="Enter a title for this card..."
                  on:keydown={(event) => {
                       event.key === 'Enter' && addCard();
                       event.key === 'Escape' && offEditMode();
                       event.key === 'Esc' && offEditMode();
                    }}></textarea>
        <div class="actions">
            <div class="btn success" on:click={addCard}>Add card</div>
            <div class="btn" on:click={offEditMode}>Cancel</div>
        </div>
    </div>
{:else}
    <!-- editmode 아닐 때 -->
    <div class="add-another-card" on:click={onEditMode}>
        + Add another card
    </div>
{/if}

<style lang="scss">
    .add-another-card {
      padding: 4px 8px;
      font-size: 14px;
      color: #5e6c84;
      cursor: pointer;
      border-radius: 4px;
      &:hover {
        background-color: rgba(9, 30, 66, .08);
        color: #172b4d;
      }
    }
</style>