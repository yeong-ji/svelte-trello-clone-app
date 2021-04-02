<script>
    import Sortable from 'sortablejs';
    import { onMount } from 'svelte';
    import { lists } from '~/store/list'
    import List from '~/components/List.svelte'
    import CreateList from '~/components/CreateList.svelte'

    let listsEl, sortableLists ;

    onMount(()=>{
        //console.log(listsEl) // document.querySelector('.lists');
        sortableLists = new Sortable(listsEl, {
            group: 'My Lists',
            handle: '.list',
            delay: 50,
            animation: 0,
            forceFallback: true,
            // 요소의 드래그 앤 드롭 이 종료 되면 실행할 콜백함수
            onEnd(event){
                console.log(event);
                lists.reorder({
                    oldIndex: event.oldIndex,
                    newIndex: event.newIndex
                })
            }
        })
    })

</script>

<div class="list-container">
    <div bind:this={listsEl} class="lists">  <!-- ul id items -->
        {#each $lists as list (list.id)}
            <List list={list} sortableLists={sortableLists} />  <!-- li 태그 역할 -->
        {/each}
    </div>
    <CreateList />
</div>

<style lang="scss">
    .list-container {
      width: 100vw;
      height: calc(100vh - 40px);
      padding: 30px;
      box-sizing: border-box;
      overflow-y: hidden;
      white-space: nowrap;
      font-size: 0;
      .lists {
        display: inline-block;
        height: 100%;
        white-space: nowrap;
        font-size: 0;
      }
    }
</style>