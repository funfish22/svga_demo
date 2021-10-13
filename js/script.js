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
// parser.fillMode = 'Forward'

const handleChangeSvga = (target) => {
    hoverSwitch = true;

    parser.load(`./image/${target.dataset.src}`, (videoItem) => {
        videoItemDom = videoItem;
        
        player.setVideoItem(videoItemDom);
        player.clearsAfterStop = false;
        if(reversePlaySvga.checked) {
            player.clearsAfterStop = true
            player.startAnimation(true);
            return
        }
        player.startAnimation(); // player.startAnimation(true); 動畫反轉
        // player.startAnimationWithRange({location: 0, length: 10}, false)
        // player.stepToPercentage(30, true)
        // console.log('videoItem.frames', videoItem.frames * 100 - 1000)
        // player.startAnimationWithRange({location: 0, length: videoItemDom.frames - 1}, false)
        player.onFrame((time) => {
            showTime = time;
        });
        if (delayRemoveSvga.checked) {
            player.onFinished(() => {
                setTimeout(() => {
                    player.clear();
                }, 3000);
            });
        }
        // setTimeout(() => {
        //     player.pauseAnimation();
        // }, (videoItemDom.frames / videoItemDom.FPS) * 1000);

        // if (delayRemoveSvga.checked) {
        //     setTimeout(() => {
        //         player.clear();
        //     }, (videoItemDom.frames / videoItemDom.FPS) * 1000 + 3000);
        // }
    });
};

const handleHoverSvga = () => {
    if (hoverSwitch && !delayRemoveSvga.checked && !reversePlaySvga.checked) {
        player.pauseAnimation();
        player.startAnimationWithRange(
            { location: 0, length: showTime - 1 },
            true
        );
        player.clearsAfterStop = true;
        hoverSwitch = false;
    }

    // if (hoverSwitch && !delayRemoveSvga.checked) {
    //     player.startAnimation(true);
    //     player.clearsAfterStop = true
    //     // setTimeout(() => {
    //     //     player.pauseAnimation()
    //     // },(videoItemDom.frames/videoItemDom.FPS) * 1000)
    //     hoverSwitch = false;
    // }
};

for (let i = 0; i < svgaButton.length; i++) {
    svgaButton[i].addEventListener("click", () =>
        handleChangeSvga(svgaButton[i])
    );
}

demoCanvas.addEventListener("mouseover", handleHoverSvga);
