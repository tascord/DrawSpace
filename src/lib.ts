import { Canvas, createCanvas, GlobalFonts, Image, SKRSContext2D } from '@napi-rs/canvas';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import ax from 'axios';

export default class DrawSpace {

    readonly width: number;
    readonly height: number;
    private readonly _canvas: Canvas;
    private readonly _context: SKRSContext2D;
    private _vertices: { x: number, y: number }[] = [];

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this._canvas = createCanvas(width, height);
        this._context = this._canvas.getContext('2d');
    }

    public get __raw() {
        return this._context;
    }

    // Importing images

    /**
     * Loads an image from a local file via path or from a url
     * @param path_or_url Path or remote URL to image
     * @param width Width of image
     * @param height Height of image
     * @returns Image
     */
    public async load_image(path_or_url: string, width: number, height: number) {
        const image = new Image(width, height);

        if (existsSync(path_or_url)) {
            image.src = readFileSync(path_or_url);
        } else {
            try {
                image.src = await (await ax.get(path_or_url, { responseType: 'arraybuffer' })).data;
            } catch (e) {
                throw new Error(`Failed to load remote image from ${path_or_url}\n${e}`);
            }
        }

        return image;

    }

    // Drawing text

    /**
     * 
     * @param text Text to draw. Set colour via %#colour% tags. E.g. "Hello%#ff0000% World!"
     * @param font Font to use (Don't include the size)
     * @param x_pos X position of the text
     * @param y_pos Y position of the text (baseline)
     * @param align Aligment of the text (relative to the x_pos)
     * @param max_width Text is sized to fit this width. Defaults to canvas width
     * @param default_size Default size of the text. Defaults to 20px
     * @returns DrawSpace
     */
    public draw_text(text: string, font: string, x_pos: number, y_pos: number, align: 'left' | 'center' | 'right' = 'center', max_width: number = this._canvas.width, default_size: number = 20) {

        this._context.font = `${default_size}px ${font}`;
        const raw = text.replace(/(?<!\\)(%.+?%)/g, '');
        let width;

        // Scale font to fit
        while ((width = this._context.measureText(raw).width) > max_width) {
            this._context.font = `${default_size -= 1}px ${font}`;
        }

        // Get colours
        const instructions: { text: string, colour: string }[] = [];
        text.split(/%/).forEach((x, i, a) => {

            if (a[i - 1] && a[i - 1].endsWith('\\') || !x.startsWith('#')) {

                if (!instructions[instructions.length - 1]) {
                    instructions.push({ text: '', colour: '#ffffff' });
                }

                return instructions[instructions.length - 1].text += x;
            }

            instructions.push({ text: '', colour: x });
        })

        // Draw text
        let current_x = x_pos;
        for (const instruction of instructions) {

            if (!instruction.text) continue;

            const computed_x = current_x - (align === 'center' ? width / 2 : align === 'right' ? width : 0);
            this._context.fillStyle = instruction.colour;
            this._context.font = `${default_size}px ${font}`;
            this._context.fillText(instruction.text, computed_x, y_pos);

            current_x += this._context.measureText(instruction.text).width;

        }

        this._context.fillStyle = '#ffffff';
        return this;

    }

    // Drawing primatives

    /**
     * Draws a rectangle
     * @param x Top left x position
     * @param y Top left y position
     * @param width Width of the rectangle
     * @param height Height of the rectangle
     * @param colour Colour to fill the rectangle
     * @returns DrawSpace
     */
    public draw_rect(x: number, y: number, width: number, height: number, colour: `#${string}`) {
        this._context.fillStyle = colour;
        this._context.fillRect(x, y, width, height);
        this._context.fillStyle = '#ffffff';
        return this;
    }


    /**
     * Draws an arc
     * @param x Top left x position
     * @param y Top left y position
     * @param radius Radius of the arc
     * @param start_angle Start angle of the arc (in degrees)
     * @param end_angle End angle of the arc (in degrees)
     * @param colour Colour of the arc
     * @param fill Whether to fill or stroke the arc
     * @returns DrawSpace
     */
    public draw_arc(x: number, y: number, radius: number, start_angle: number, end_angle: number, colour: `#${string}`, fill: boolean = true) {
        this._context.fillStyle = colour;
        this._context.strokeStyle = colour;

        this._context.beginPath();
        this._context.arc(x, y, radius, start_angle, end_angle);

        if (fill) this._context.fill();
        else this._context.stroke()

        this._context.closePath();
        this._context.fillStyle = '#ffffff';
        this._context.strokeStyle = '#ffffff';
        return this;
    }

    /**
     * Draws a line
     * @param x First x position
     * @param y First y position
     * @param x1 Second x position
     * @param y1 Second y position
     * @param colour Colour to stroke the line
     * @returns DrawSpace
     */
    public draw_line(x: number, y: number, x1: number, y1: number, colour: `#${string}`) {
        this._context.strokeStyle = colour;

        this._context.beginPath();
        this._context.moveTo(x, y);
        this._context.lineTo(x1, y1);
        this._context.stroke();
        this._context.closePath()

        this._context.strokeStyle = '#ffffff';
        return this;
    }

    /**
     * Draws an image to the canvas
     * @param path_or_url_or_image Pre-loaded image, or path to image, or remote url
     * @param x Top left x position
     * @param y Top left y position
     * @param width Width of the image
     * @param height Height of the image
     * @returns Promise of DrawSpace
     */
    public async draw_image(path_or_url_or_image: Image | string, x: number, y: number, width: number, height: number) {
        this._context.fillStyle = '#ffffff';
        this._context.drawImage(
            path_or_url_or_image instanceof Image ? path_or_url_or_image : await this.load_image(path_or_url_or_image, width, height),
            x, y, width, height
        );

        return this;
    }

    // Polygon
    private _vertices_to_path() {
        this._context.beginPath();
        for (const vertex of this._vertices) {
            this._context.lineTo(vertex.x, vertex.y);
        }
        this._context.closePath();
    }

    /**
     * Places a vertex at the given position for the polygon
     * @param x X position of vertex
     * @param y Y position of vertex
     * @returns DrawSpace
     */
    public vert(x: number, y: number) {
        this._vertices.push({ x, y });
        return this;
    }

    /**
     * Clears all vertices from the polygon
     * @returns DrawSpace
     */
    public vert_clear() {
        this._vertices = [];
        return this;
    }

    /**
     * Stroke's the created polygon
     * @param colour Colour to stroke the polygon
     * @returns 
     */
    public vert_stroke(colour: `#${string}`) {
        this._context.strokeStyle = colour;
        this._vertices_to_path();
        this._context.stroke();
        this.vert_clear()
        return this;
    }

    /**
     * Fills the created polygon
     * @param colour Colour to fill the polygon
     * @returns DrawSpace
     */
    public vert_fill(colour: `#${string}`) {
        this._context.fillStyle = colour;
        this._vertices_to_path();
        this._context.fill();
        return this;
    }

    // Settings

    /**
     * Registers a font from a file for later use
     * @param font Font name for later use
     * @param path Path to the font file
     * @returns DrawSpace
     */
    public register_font(font: string, path: string) {
        if(!GlobalFonts.registerFromPath(font, path)) throw new Error(`Unable to register font ${font}`);
        return this;
    }

    /**
     * Sets the thickness of stroke's
     * @param width Width of the stroke
     * @returns DrawSpace
     */
    public set_thickness(width: number) {
        this._context.lineWidth = width;
        return this;
    }

    // Exporting canvas

    /**
     * Fetches the canvas as a buffer of data
     * @param format Format of the image to export
     * @returns Image Buffer
     */
    public to_buffer(format: 'png') {
        return this._canvas.encode(format);
    }

    /**
     * Fetches the canvas and saves it to a file
     * @param format Format of the image to export
     * @param path Path to save the file at
     */
    public async to_file(format: 'png', path: string) {
        writeFileSync(path, await this.to_buffer(format));
    }

}