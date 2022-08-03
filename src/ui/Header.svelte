<script lang="ts">
export let name: string;
export let link: string;
export let show:boolean;

function downloadFile(): void {
    var tempElem = document.createElement("a");
    tempElem.download = name;
    tempElem.href = link;
    tempElem.click();
}
</script>

<style>
.header {
    top: 0;
    width: 100vw;
    border-bottom: solid 1px rgba(255, 255, 255, .3);
    height: 60px;
    display: flex;
    align-items: center;
    position: fixed;
    top:0;
    transition: top 0.2s ease-in-out;
    backdrop-filter: blur(10px) grayscale(50%);
}

.fileName {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    max-width: 300px;
    margin: 0;
    margin-left: 30px;
    display: flex;
    align-items: center;
    color: #fff;
}

.downloadBtn {
    padding: 10px;
    font-size: 10pt;
    white-space: nowrap;
    margin-right: 20px;
    background-color: rgba(255, 255, 255, .05);
    color: rgba(255, 255, 255, .7);
    cursor: pointer;
    display: flex;
    flex-direction: row;
    transition: all 0.1s ease-in-out;
    margin-left: auto;
}

.downloadBtn:hover {
    background-color: rgba(255, 255, 255, .2);
}

.downloadBtn p {
    margin: 0;
    margin-left: 5px;
    padding: 0;
    font-size: 9pt;
}
.hidden {
    top: -61px;
}
.usernameArr {
    margin-right: 10px;
    margin-left: auto;
    display: flex;
    align-items: center;
    color: #fff;
    font-size: 10pt;
}
.username {
    background-color: #000;
    padding: 5px 8px 5px 8px;
    margin-left: 5px;
    border-radius: 5px;
    font-size: 8pt;
    color: rgba(255,255,255,.7);
}
.info {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 13pt;
    margin-left: auto;
    margin-right: 10px;
}
</style>

    <div class="header {show?"":"hidden"}">
        <p class="fileName">
            {name}
        </p>
        {#if link}
        <div class="downloadBtn" on:click={downloadFile}>
            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><g><path fill="none" d="M0 0h24v24H0z"></path><path d="M13 10h5l-6 6-6-6h5V3h2v7zm-9 9h16v-7h2v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-8h2v7z"></path></g></svg>
            <p>다운로드</p>
        </div>
        {/if}
    </div>
