<script>
    import CreateCard from '~/components/CreateCard.svelte'
    import ListTitle from '~/components/ListTitle.svelte'
    import Card from '~/components/Card.svelte'
    import { onMount } from "svelte";
    import { cards } from '~/store/list'
    import Sortable from "sortablejs";


    export let list;
    export let sortableLists;

    let sortableCards, cardsEl;

    //sortable 의 기능을 비활성화 시키는 함수를 생성
    function disableSortable(event){
        sortableCards.option('disabled', event.detail)
        sortableLists.option('disabled', event.detail)
    }

    onMount(()=>{
        //console.log(listsEl) // document.querySelector('.lists');
        sortableCards = new Sortable(cardsEl, {
            group: 'My Cards',
            handle: '.card',
            delay: 50,
            animation: 0,
            forceFallback: true,
            // 요소의 드래그 앤 드롭 이 종료 되면 실행할 콜백함수
            onEnd(event){
                console.log(event);
                cards.reorder({
                    // fromListId 시작하는 list의 id  //  toListId 도착한 list의 id
                    fromListId: event.from.dataset.listId,
                    toListId: event.to.dataset.listId,
                    oldIndex: event.oldIndex,
                    newIndex: event.newIndex
                })
            }
        })
    })

</script>

<div class="list">
    <div class="list__inner">
        <div class="list__heading">
            <ListTitle list={list} on:editMode={disableSortable} />
            <p>
                {list.cards.length} card
            </p>
        </div>
        <div data-list-id={list.id} bind:this={cardsEl} class="list__cards"> <!-- ul 역할 -->
            {#each list.cards as card (card.id)}
                <Card card={card} listId={list.id} on:editMode={disableSortable} /> <!-- li 역할 -->
            {/each}
        </div>
        <CreateCard listId={list.id} on:editMode={disableSortable} />
    </div>
</div>

<style lang="scss">
    .list {
      display: inline-block;
      font-size: 16px;
      white-space: normal;
      width: 290px;
      height: 100%;
      box-sizing: border-box;
      margin: 0 4px;
      line-height:20px;
      :global(&.sortable-ghost) {
        opacity: .2;
        position: relative;
        &::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: #000;
          border-radius: 4px;
        }
      }
      :global(&.sortable-chosen){
        cursor: move;
      }
      .list__inner {
        background-color: #ebecf0;
        border-radius: 4px;
        box-sizing:border-box;
        display:flex;
        flex-direction:column;
        max-height:100%;
        padding: 10px 8px;
        .list__heading {
          margin-bottom: 10px;
          p {
            color: #5e6c84;
            padding: 0 8px;
          }
        }
        .list__cards {
          margin-bottom: 10px;
          overflow-y:auto;
          overflow-x:hidden;
        }
      }
    }
</style>