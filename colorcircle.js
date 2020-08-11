const height = 512;
const width = 512;

let ctx = document.getElementById('canvas').getContext('2d');
let image = ctx.createImageData(width, height);

let colors = [
    '#fed552',
    '#554171',
    '#ee762e',
    '#ea5b76',
    '#6bb6b0',
    '#afa690',
    '#d1342c',
    '#e9739b',
    '#274079',
    '#58a6dc',
    '#b63b40',
    '#9bce92',
    '#d7385f',
    '#ebe1ff',
    '#efb864',
    '#7f6575',
    '#92cfbb',
    '#bee3e3',
    '#5abfb7',
    '#454341',
    '#7278a8',
    '#f7e78e',
    '#aeb49c',
    '#c7b83c',
    '#f19557',
    '#eb613f',
    '#ed90ba',
    '#f1becb',
    '#eceb70',
    '#e25a9b',
    '#99b7dc',
    '#b54461',
    '#d7a96b',
    '#6495cf',
    '#7e6ca8',
    '#f19591',
    '#f5ad3b',
    '#788bc5',
    '#fff03c'

];

//https://lab.syncer.jp/Web/JavaScript/Snippet/61/
function hex2rgb ( hex ) {
	if ( hex.slice(0, 1) == "#" ) hex = hex.slice(1) ;
	if ( hex.length == 3 ) hex = hex.slice(0,1) + hex.slice(0,1) + hex.slice(1,2) + hex.slice(1,2) + hex.slice(2,3) + hex.slice(2,3) ;

	return [ hex.slice( 0, 2 ), hex.slice( 2, 4 ), hex.slice( 4, 6 ) ].map( function ( str ) {
		return parseInt( str, 16 ) ;
	} ) ;
}

function x2xx(x){
    return x-width/2;
}
function y2yy(y){
    return height/2-y;
}
function xx2x(xx){
    return Math.round(xx+width/2);
}
function yy2y(yy){
    return Math.round(height/2-yy);
}

function fillCircle(R, rgba){

    fillCircleSector(0,Math.PI*2,R,rgba);
}

function fillCircleSector(fromRad, toRad, fromR, toR, rgba){
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const xx = x2xx(x);
            const yy = y2yy(y);
            const r = Math.sqrt(xx*xx+yy*yy);
            const rad = (Math.atan2(yy,xx) + Math.PI*2) % (Math.PI*2);

            let color = Array.from(rgba);

            let alpha = 1;

            if (rad < fromRad){
                continue;
            } else if (rad > toRad){
                continue;
            } else {
                const dh = r*Math.sin(rad-fromRad);
                if (dh<1) alpha = alpha*dh;
                const dh2 = r*Math.sin(toRad-rad);
                if (dh2<1) alpha = alpha*dh2;
                color[3] = Math.round(color[3]*alpha);
            }

            if (r < fromR){
                continue;
            } else if (r > toR){
                continue;
            } else {
                let dr = r - fromR;
                if (dr < 1) alpha = alpha*dr;
                dr = toR - r;
                if (dr < 1) alpha = alpha*dr;
                color[3] = Math.round(color[3]*alpha);
                setColor(xx2x(xx),yy2y(yy),color);
            }
            /*
            if (dr > 1){
                setColor(xx2x(xx),yy2y(yy),color);
            } else if(dr < 0){
                continue;
            } else {
                color[3] = Math.round(color[3]*dr);
                setColor(xx2x(xx),yy2y(yy),color);
            }
            */
        }
    }
}

function overrideColor(base, data,a){
    return Math.round(base*(255-a)/255 + data*a/255);
}

function setColor(x,y,rgba){
    
    image.data[(x + y * width) * 4] = rgba[0];
    image.data[(x + y * width) * 4 + 1] = rgba[1];
    image.data[(x + y * width) * 4 + 2] = rgba[2];
    image.data[(x + y * width) * 4 + 3] = rgba[3];
}

function generateCircle(){
    const text = document.getElementById("text").value;
    colors = text.split(/\r\n|\n/);
    drawCircle();
}

function drawCircle(){
    image = ctx.createImageData(width, height);
    ctx.clearRect(0, 0, width, height);

    const color_number = colors.length;
    for (let i=0; i<color_number; i++){
        const color = colors[i];
        const rgb = hex2rgb(color);
        const angle = Math.PI*2/color_number;
        fillCircleSector(i*angle,(i+1)*angle - angle*0.15,height / 4, height / 2, [rgb[0], rgb[1], rgb[2], 255]);
    }

    ctx.putImageData(image, 0, 0);
}

function init(){
    drawCircle();
}

init();
