import DrawSpace from "../src/lib";

const x = new DrawSpace(720, 720);

x
    .draw_rect(0, 0, x.width, x.height, '#252525')
    .set_thickness(5)
    
    .draw_rect(x.width / 2, x.height / 2, 100, 100, '#ffffff')

    .to_file('png', './o.png');