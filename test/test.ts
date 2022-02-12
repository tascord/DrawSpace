import DrawSpace from "../src/lib";
import { join } from "path";

const x = new DrawSpace(720, 720);
const out = join(__dirname, "o.png");

const [w, h] = [x.width, x.height];

const flags = [
    [['non binary', 'enby', 'nb'], 'https://assets.volvo.com/is/image/VolvoInformationTechnologyAB/image7?qlt=82&wid=1024&ts=1624608471413&fit=constrain&fmt=png-alpha'],
    [['gay', 'pride', 'rainbow'], 'https://assets.volvo.com/is/image/VolvoInformationTechnologyAB/Color-Pride-Flag?qlt=82&wid=1024&ts=1625042756595&fit=constrain&fmt=png-alpha'],
    [['trans', 'transgender'], 'https://assets.volvo.com/is/image/VolvoInformationTechnologyAB/transgender?qlt=82&wid=1024&ts=1625042771981&fit=constrain&fmt=png-alpha'],
    [['intersex'], 'https://assets.volvo.com/is/image/VolvoInformationTechnologyAB/image8?qlt=82&wid=1024&ts=1624608672716&fit=constrain&fmt=png-alpha'],
    [['ace', 'ase', 'asexual'], 'https://assets.volvo.com/is/image/VolvoInformationTechnologyAB/image9?qlt=82&wid=1024&ts=1624609190475&fit=constrain&fmt=png-alpha'],
    [['bi', 'bisex', 'bisexual'], 'https://assets.volvo.com/is/image/VolvoInformationTechnologyAB/image10?qlt=82&wid=1024&ts=1624610028985&fit=constrain&fmt=png-alpha'],
    [['pan', 'pansex', 'pansexual'], 'https://assets.volvo.com/is/image/VolvoInformationTechnologyAB/image11?qlt=82&wid=1024&ts=1624610086795&fit=constrain&fmt=png-alpha'],
    [['lesbian'], 'https://assets.volvo.com/is/image/VolvoInformationTechnologyAB/image12?qlt=82&wid=1024&ts=1624610166595&fit=constrain&fmt=png-alpha'],
    [['mlm', 'gay man'], 'https://assets.volvo.com/is/image/VolvoInformationTechnologyAB/image14?qlt=82&wid=1024&ts=1624610320380&fit=constrain&fmt=png-alpha'],
] as const;

async function gay(flag: typeof flags[number][0][number], url: string) {

    await x.draw_image(url, 0, 0, w, h);

    const f = flags.find(f => f[0].includes(flag as never));
    if (!f) throw new Error(`Unknown flag '${flag}'.`);

    await x.draw_image(f[1], 0, 0, w, h, '#ffffff99');

    await x.to_file('png', out);
}

gay('trans', 'https://cdn.discordapp.com/avatars/205811939861856257/1a6cd699b438c93eeda1b2ee5a66d31c.png?size=2048');