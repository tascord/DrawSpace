import DrawSpace from "../src/lib";
import { join } from "path";

const x = new DrawSpace(720, 720);
const out = join(__dirname, "o.png");

const [w, h] = [x.width, x.height];

function ratio(n: number) {

    x.draw_rect(0, 0, x.width, x.height, '#252525')
    const ratio = n + '/50';

    function mc(text: string, xp: number, yp: number, size: number, c = false) {

        const shadow_offset = size * (ratio.split('/').map(x => Number(x)).reduce((a, b) => a / b));
        x.draw_text(`%#${c ? '153F15' : 'ffffff'}%` + text, 'Minecraftia', xp + shadow_offset, yp + shadow_offset, c ? 'right' : 'left', x.width, size);
        x.draw_text(`%#${c ? '55FF55' : 'ffffff'}%` + text, 'Minecraftia', xp, yp, c ? 'right' : 'left', x.width, size);

    }

    // White
    mc('Hello', 20, 200, 100);
    mc('Hello', 20, 300, 90);
    mc('Hello', 20, 390, 80);
    mc('Hello', 20, 470, 70);
    mc('Hello', 20, 540, 60);
    mc('Hello', 20, 600, 50);
    mc('Hello', 20, 650, 40);
    mc('Hello', 20, 690, 30);
    mc('Hello', 20, 720, 20);

    mc('Hello', w - 20, 200, 100, true);
    mc('Hello', w - 20, 300, 90, true);
    mc('Hello', w - 20, 390, 80, true);
    mc('Hello', w - 20, 470, 70, true);
    mc('Hello', w - 20, 540, 60, true);
    mc('Hello', w - 20, 600, 50, true);
    mc('Hello', w - 20, 650, 40, true);
    mc('Hello', w - 20, 690, 30, true);
    mc('Hello', w - 20, 720, 20, true);

    x.draw_text('%#AAAAAA%Ratio:', 'Minecraftia', w / 2, h - 60, 'center', x.width, 15);
    x.draw_text('%#FF55FF%' + ratio, 'Minecraftia', w / 2, h - 20, 'center', x.width, 30);

    x.to_file('png', join(__dirname, 'outs', ratio.replace('/', '_') + '.png'));
}

for(let i = 6; i < 10; i+=0.25) {
    ratio(i);
}