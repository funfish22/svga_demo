const svgaButton = [...document.querySelectorAll(".js-button")];
const demoCanvas = document.getElementById("demoCanvas");
const delayRemoveSvga = document.getElementById("delayRemoveSvga");
const reversePlaySvga = document.getElementById("reversePlaySvga");

var player = new SVGA.Player("#demoCanvas");
var parser = new SVGA.Parser("#demoCanvas"); // Must Provide same selector eg:#demoCanvas IF support IE6+
player.loops = 1;
let hoverSwitch;
let videoItemDom;
let showTime;

const handleChangeSvga = (target) => {
    hoverSwitch = true;

    parser.load(`./image/${target.dataset.src}`, (videoItem) => {
        videoItemDom = videoItem;
        
        player.setVideoItem(videoItemDom);
        player.clearsAfterStop = false; // 動畫結束後，SVGA不會消失
        if(reversePlaySvga.checked) {
            player.clearsAfterStop = true
            player.startAnimation(true); // 動畫反轉
            return
        }
        player.startAnimation(); // 動畫開始

        // 計算到第幾幀
        player.onFrame((time) => {
            showTime = time;
        });
        if (delayRemoveSvga.checked) {
            player.onFinished(() => {
                setTimeout(() => {
                    player.clear(); // 移除SVGA
                }, 3000);
            });
        }
    });
};

const handleHoverSvga = () => {
    if (hoverSwitch && !delayRemoveSvga.checked && !reversePlaySvga.checked) {
        player.pauseAnimation();
        player.startAnimationWithRange(
            { location: 0, length: showTime - 1 },
            true
        ); // 範圍 {location 初始幀，length 結束幀}， true(動畫反轉)，false(動畫正轉)
        player.clearsAfterStop = true; // 動畫結束後，SVGA消失
        hoverSwitch = false;
    }
};

for (let i = 0; i < svgaButton.length; i++) {
    svgaButton[i].addEventListener("click", () =>
        handleChangeSvga(svgaButton[i])
    );
}

demoCanvas.addEventListener("mouseover", handleHoverSvga);
