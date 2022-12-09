<script lang="ts">
  import { documentLoaded, getFileBlob } from "./lib/decrypt";
  import Header from "./ui/Header.svelte";
  import { getMimeFromName } from "./lib/utils/mime";
  var fileName: string = "",
    fileMime: string;
  var fileURL: string = "";
  var username: string = "";
  var showAddition: boolean = false;
  var isFullScreen: boolean = false;
  var imgSize: number[] = [window.innerWidth * 0.85];
  let downloadState: number = 0;
  function changeProgress(n: number) {
    downloadState = n;
  }
  async function loaded(url: string) {
    var json = await documentLoaded(url);
    fileName = json["Name"];
    username = json["Username"];
    fileMime = getMimeFromName(fileName);
    showAddition = true;
    fileURL = await getFileBlob(fileMime, json, changeProgress);

    var prevtoid: any;
    if (fileMime.split("/")[0] === "image") {
      window.addEventListener("mousemove", () => {
        showAddition = true;
        clearTimeout(prevtoid);
        prevtoid = setTimeout(() => {
          showAddition = false;
        }, 3000);
      });
    }
  }
  function downloadFile(): void {
    var tempElem = document.createElement("a");
    tempElem.download = fileName;
    tempElem.href = fileURL;
    tempElem.click();
  }
  function magnify(tf: boolean) {
    if (tf) {
      imgSize = [imgSize[0] * 0.75];
    } else {
      imgSize = [imgSize[0] * 1.25];
    }
  }
  function setFullSize() {
    if (isFullScreen) {
      isFullScreen = false;
      imgSize = [window.innerWidth * 0.85];
      document.exitFullscreen();
    } else {
      isFullScreen = true;
      imgSize = [window.innerWidth];
      document.documentElement.requestFullscreen();
    }
  }
</script>

<main>
  <Header name={fileName} link={fileURL} show={showAddition} />
  <div class="mainBody">
    {#if fileURL}
      {#if fileMime.split("/")[0] == "image"}
        <img src={fileURL} alt="img" width={imgSize[0]} />
        <div class="imgControl" style="display:{showAddition ? '' : 'none'}">
          <div class="focus">
            <div class="eachBtn" on:click={() => magnify(false)}>
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 24 24"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
                ><g
                  ><path fill="none" d="M0 0h24v24H0z" /><path
                    d="M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15zM10 10V7h2v3h3v2h-3v3h-2v-3H7v-2h3z"
                  /></g
                ></svg
              >
            </div>
            <div class="eachBtn" on:click={() => magnify(true)}>
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 24 24"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
                ><g
                  ><path fill="none" d="M0 0h24v24H0z" /><path
                    d="M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15zM7 10h8v2H7v-2z"
                  /></g
                ></svg
              >
            </div>
            <div class="eachBtn" on:click={setFullSize}>
              {#if !isFullScreen}
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 24 24"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                  ><g
                    ><path fill="none" d="M0 0h24v24H0z" /><path
                      d="M20 3h2v6h-2V5h-4V3h4zM4 3h4v2H4v4H2V3h2zm16 16v-4h2v6h-6v-2h4zM4 19h4v2H2v-6h2v4z"
                    /></g
                  ></svg
                >
              {:else}
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 24 24"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                  ><g
                    ><path fill="none" d="M0 0h24v24H0z" /><path
                      d="M18 7h4v2h-6V3h2v4zM8 9H2V7h4V3h2v6zm10 8v4h-2v-6h6v2h-4zM8 15v6H6v-4H2v-2h6z"
                    /></g
                  ></svg
                >
              {/if}
            </div>
          </div>
        </div>
      {:else}
        <div class="directDown">
          No Preview Avilable
          <div class="directDownloadBtn" on:click={downloadFile}>Download</div>
        </div>
      {/if}
    {:else}
      <div class="loaders">
        <div class="loading" />
        <p>{Math.round(downloadState)}%</p>
      </div>
    {/if}
  </div>
</main>
<svelte:window on:load={() => loaded(window.location.pathname)} />
<svelte:head>
  {#if fileName == ""}
    <title>Crypithm</title>
  {:else}
    <title>{fileName} - Crypithm</title>
  {/if}
</svelte:head>

<style>
  .loaders {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  .loaders p {
    margin: 20px;
    color: rgba(255, 255, 255, 0.6);
  }
  img {
    transition: all 0.2s ease-in-out;
    user-select: none;
  }
  .mainBody {
    display: flex;
    height: 100vh;
    width: 100%;
    align-items: center;
    justify-content: center;
  }

  .imgControl {
    display: flex;
    position: fixed;
    bottom: 70px;
    left: calc((100% / 2) - 75px);
    background-color: #000;
    width: 150px;
    height: 50px;
    z-index: 1;
    border-radius: 7px;
    border: solid 1px rgba(255, 255, 255, 0.2);
  }

  .focus {
    display: flex;
    align-items: center;
    height: 100%;
    color: rgba(255, 255, 255, 0.8);
    justify-content: space-evenly;
    width: 100%;
  }

  .eachBtn {
    font-size: 15pt;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  .eachBtn:nth-child(2) {
    border-right: solid 1px rgba(255, 255, 255, 0.5);
    padding-right: 15px;
  }
  .directDown {
    display: flex;
    flex-direction: column;
    color: #fff;
  }
  .directDownloadBtn {
    background-color: #242424;
    color: rgba(255, 255, 255, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 20px 10px 20px;
    border-radius: 2px;
    cursor: pointer;
    margin-top: 20px;
  }
  .loading {
    width: 30px;
    height: 30px;
    border: solid 3px #fff;
    border-top: solid 3px #191919;
    border-radius: 18px;
    transform: rotate(0deg);
    animation: load 1s ease-in-out infinite;
  }
  @keyframes load {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
