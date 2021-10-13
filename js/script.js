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

reversePlaySvga.addEventListener('click', (e) => {
    if(e.target.checked) {
        demoCanvas.classList.add('reverse')
    } else {
        demoCanvas.classList.remove('reverse')
    }
})

const handleChangeSvga = (target) => {
    hoverSwitch = true;

    parser.load(`./image/${target.dataset.src}`, (videoItem) => {
        videoItemDom = videoItem;
        console.log('videoItem', videoItem)
        
        player.setVideoItem(videoItemDom);
        player.clearsAfterStop = false; // 動畫結束後，SVGA不會消失
        if(reversePlaySvga.checked) {
            player.setVideoItem(videoItemDom);
            demoCanvas.classList.add('fade')
            player.clearsAfterStop = true
            player.startAnimation(true); // 動畫反轉
            player.onFinished(() => {
                demoCanvas.classList.remove('fade')
                demoCanvas.classList.remove('fadeIn')
            });
            return
        }
        demoCanvas.classList.add('fadeIn')
        player.startAnimation(); // 動畫開始

        // 計算到第幾幀
        player.onFrame((time) => {
            showTime = time;
        });
        if (delayRemoveSvga.checked) {
            player.onFinished(() => {
                setTimeout(() => {
                    demoCanvas.classList.add('fadeOut')
                }, 1000)
                setTimeout(() => {
                    demoCanvas.classList.remove('fadeOut')
                    demoCanvas.classList.remove('fadeIn')
                    player.clear(); // 移除SVGA
                }, 3000);
            });
        }
    });
};

const handleHoverSvga = () => {
    if (hoverSwitch && !delayRemoveSvga.checked && !reversePlaySvga.checked) {
        player.pauseAnimation();
        demoCanvas.classList.add('fadeOut')
        player.startAnimationWithRange(
            { location: 0, length: showTime - 1 },
            true
        ); // 範圍 {location 初始幀，length 結束幀}， true(動畫反轉)，false(動畫正轉)
        player.onFinished(() => {
            demoCanvas.classList.remove('fadeOut')
            demoCanvas.classList.remove('fadeIn')
            player.clearsAfterStop = true; // 動畫結束後，SVGA消失
        });
    }
    
    hoverSwitch = false;
};

for (let i = 0; i < svgaButton.length; i++) {
    svgaButton[i].addEventListener("click", () =>
        handleChangeSvga(svgaButton[i])
    );
}

demoCanvas.addEventListener("mouseover", handleHoverSvga);
