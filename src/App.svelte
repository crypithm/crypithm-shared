<script lang="ts">
  import {documentLoaded, getFileBlob } from './lib/decrypt'
  import Header from "./ui/Header.svelte";
  import {getMimeFromName} from './lib/utils/mime'
  var fileName:string="", fileMime:string =""
  var fileURL:string =""
  async function loaded(url:string) {
    var json = await documentLoaded(url)
    fileName = json["Name"] 
    fileMime = getMimeFromName(fileName)
    fileURL = await getFileBlob(fileMime, json)
    console.log(fileURL)
  }
</script>

<main>
<Header name={fileName} link={fileURL}/>
<div class="mainBody">
  {#if fileMime.split("/")[0]=="image"}
    <div></div>
  {:else}
    <div></div>
  {/if}
</div>
</main>
<svelte:window on:load={()=>loaded(window.location.pathname)}/>
<svelte:head>
  {#if fileName == ""}
  <title>Crypithm</title>
  {:else}
  <title>{fileName} - Crypithm</title>
  {/if}
</svelte:head>
<style>
.mainBody{
  display: flex;
}
</style>