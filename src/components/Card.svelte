<script>
    import { onDestroy, tick, createEventDispatcher } from 'svelte'
    import { autoFocusout } from "../actions/autoFocusout";
    import { cards } from '~/store/list'

    export let card;
    export let listId;

    let isEditMode = false;
    let textareaEl;
    let title = card.title;

    const dispatch = createEventDispatcher();

    function saveCard(){
        if(title.trim()){
            cards.edit({
                // listId 필요 수정하려는 카드가 어떤 리스트에 들어있는지 알아야 그 안에 cards 를 찾을 수 있다.
                // cardId 필요
                // title 필요
                listId: listId,
                cardId: card.id,
                title: title
            })
        }
        offEditMode();
    }
    function removeCard(){
        cards.remove({
            listId: listId,
            cardId: card.id
        })
        offEditMode();
    }
    async function onEditMode(){
        isEditMode = true;
        // title = card.title;
        dispatch('editMode', true)
        await tick();
        textareaEl && textareaEl.focus();
    }
    function offEditMode(){
        isEditMode = false;
        title = card.title;
        dispatch('editMode', false)
    }

    onDestroy(()=>{
        offEditMode();
    })
</script>

<div class="card">
    {#if isEditMode}
        <div use:autoFocusout={offEditMode} class="edit-mode">
            <textarea bind:value={title} bind:this={textareaEl} placeholder="Enter a title for this card..."
                        on:keydown={(event)=>{
                            event.key === 'Enter' && saveCard()
                            event.key === 'Escape' && offEditMode()
                            event.key === 'Esc' && offEditMode()
                        }}
            ></textarea>
            <div class="actions">
                <div class="btn success" on:click={saveCard}>Save</div>
                <div class="btn" on:click={offEditMode}>Cancel</div>
                <div class="btn danger" on:click={removeCard}>Delete Card</div>
            </div>
        </div>
    {:else}
        <div class="title">
            {title}
            <div class="btn small edit-btn-for-list" on:click={onEditMode}>
                Edit
            </div>
        </div>
    {/if}
</div>

<style lang="scss">
    .card{
      margin-bottom: 8px;
      user-select: none;
      &:last-child {
        margin-bottom: 1px;
      }
      :global(&.sortable-ghost){
        position: relative;
        opacity: .1;
        &::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #000;
          border-radius:4px;
        }
      }
      :global(&.sortable-chosen){
        cursor: move;
      }
      .title {
        background-color: #fff;
        padding: 6px 8px;
        border-radius: 4px;
        box-shadow: 0 1px 0 rgba(9, 30, 66, .25);
        line-height: 20px;
        position: relative;
        &:hover {
          background-color: #f5f5f5;
        }
        .btn {
          display: none;
          position: absolute;
          right: 8px;
          top: 6px;
        }
        &:hover .btn {
          display: block;
        }
      }
    }
</style>