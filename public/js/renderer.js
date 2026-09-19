const TAU = Math.PI * 2;

export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d', { alpha: false });
        this.width = canvas.width;
        this.height = canvas.height;
        this.assets = this.loadAssets();
    }

    render(state) {
        const ctx = this.context;
        ctx.clearRect(0, 0, this.width, this.height);
        if (this.isAssetReady('background')) {
            ctx.drawImage(this.assets.background, 0, 0, this.width, this.height);
        } else {
            this.drawSky(ctx);
            this.drawClouds(ctx, state.elapsed);
            this.drawMountains(ctx);
            this.drawForest(ctx);
            this.drawWater(ctx, state.elapsed);
            this.drawGround(ctx);
            this.drawTarget(ctx);
        }
        state.ducks.forEach((duck) => this.drawDuck(ctx, duck));
        state.arrows.forEach((arrow) => this.drawArrow(ctx, arrow));
        this.drawArcher(ctx, state.archer, state.bow, state.currentBow);
        state.particles.forEach((particle) => this.drawParticle(ctx, particle));
        state.rewardPopups.forEach((popup) => this.drawRewardPopup(ctx, popup));

        if (state.demoRunning && state.archer.isAiming) {
            this.drawAimGuide(ctx, state.archer);
            this.drawAim(ctx, state.archer.aimTarget);

            if (state.archer.state === 'drawing') {
                this.drawCharge(ctx, state.archer.charge);
            }
        }
    }

    loadAssets() {
        if (typeof Image === 'undefined') {
            return {};
        }

        return {
            background: this.loadImage('/assets/backgrounds/vale-do-alvo.png'),
            archer: this.loadImage('/assets/sprites/arqueiro.png'),
            archerPreparing: this.loadImage('/assets/sprites/arqueiro-preparando.png'),
            archerDrawing: this.loadImage('/assets/sprites/arqueiro-puxando.png'),
            archerFullDraw: this.loadImage('/assets/sprites/arqueiro-carga-maxima.png'),
            ducks: this.loadImage('/assets/sprites/patos.png'),
            ducksUp: this.loadImage('/assets/sprites/patos-asas-altas.png'),
            bows: this.loadImage('/assets/sprites/arcos.png'),
        };
    }

    loadImage(source) {
        const image = new Image();
        image.decoding = 'async';
        image.src = source;
        return image;
    }

    isAssetReady(name) {
        const image = this.assets[name];
        return Boolean(image?.complete && image.naturalWidth > 0);
    }

    drawSky(ctx) {
        const sky = ctx.createLinearGradient(0, 0, 0, 510);
        sky.addColorStop(0, '#35b7ef');
        sky.addColorStop(.64, '#8ce2fa');
        sky.addColorStop(1, '#d9f7fb');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, this.width, this.height);

        const sun = ctx.createRadialGradient(1030, 90, 10, 1030, 90, 85);
        sun.addColorStop(0, '#fffdd1');
        sun.addColorStop(.35, '#ffeb7c99');
        sun.addColorStop(1, '#ffdf5900');
        ctx.fillStyle = sun;
        ctx.beginPath();
        ctx.arc(1030, 90, 85, 0, TAU);
        ctx.fill();
    }

    drawClouds(ctx, elapsed) {
        const clouds = [
            { x: 120, y: 105, scale: 1.1, drift: 5 },
            { x: 620, y: 82, scale: .72, drift: 8 },
            { x: 1080, y: 168, scale: .92, drift: 4 },
        ];

        ctx.fillStyle = '#ffffffdd';
        clouds.forEach((cloud) => {
            const x = (cloud.x + elapsed * cloud.drift) % 1450 - 80;
            ctx.save();
            ctx.translate(x, cloud.y);
            ctx.scale(cloud.scale, cloud.scale);
            ctx.beginPath();
            ctx.arc(0, 18, 31, 0, TAU);
            ctx.arc(38, 0, 43, 0, TAU);
            ctx.arc(83, 19, 34, 0, TAU);
            ctx.roundRect(-29, 16, 142, 42, 25);
            ctx.fill();
            ctx.restore();
        });
    }

    drawMountains(ctx) {
        const layers = [
            { color: '#78b9c1', y: 328, points: [[0, 330], [150, 186], [260, 306], [408, 136], [560, 326], [725, 174], [910, 330], [1080, 205], [1280, 330]] },
            { color: '#3e8fa5', y: 390, points: [[0, 390], [180, 270], [322, 382], [520, 218], [690, 385], [910, 244], [1075, 377], [1190, 280], [1280, 370]] },
        ];

        layers.forEach((layer, index) => {
            ctx.fillStyle = layer.color;
            ctx.beginPath();
            ctx.moveTo(0, layer.y);
            layer.points.forEach(([x, y]) => ctx.lineTo(x, y));
            ctx.lineTo(this.width, 500);
            ctx.lineTo(0, 500);
            ctx.closePath();
            ctx.fill();

            if (index === 0) {
                ctx.fillStyle = '#e7fbffcc';
                [[150, 186], [408, 136], [725, 174], [1080, 205]].forEach(([x, y]) => {
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x - 35, y + 48);
                    ctx.lineTo(x - 7, y + 35);
                    ctx.lineTo(x + 10, y + 47);
                    ctx.lineTo(x + 42, y + 58);
                    ctx.closePath();
                    ctx.fill();
                });
            }
        });
    }

    drawForest(ctx) {
        ctx.fillStyle = '#227e56';
        ctx.beginPath();
        ctx.moveTo(0, 380);
        for (let x = 0; x <= this.width; x += 34) {
            const peak = 345 + Math.sin(x * .071) * 25;
            ctx.lineTo(x + 17, peak);
            ctx.lineTo(x + 34, 405);
        }
        ctx.lineTo(this.width, 480);
        ctx.lineTo(0, 480);
        ctx.closePath();
        ctx.fill();

        for (let x = 10; x < this.width; x += 58) {
            const y = 405 + Math.sin(x) * 9;
            ctx.fillStyle = x % 116 ? '#126c45' : '#2e9556';
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + 24, y - 88 - (x % 37));
            ctx.lineTo(x + 48, y);
            ctx.closePath();
            ctx.fill();
        }
    }

    drawWater(ctx, elapsed) {
        const water = ctx.createLinearGradient(0, 430, 0, 720);
        water.addColorStop(0, '#3cc5dc');
        water.addColorStop(1, '#087ca7');
        ctx.fillStyle = water;
        ctx.fillRect(0, 430, this.width, 290);

        ctx.strokeStyle = '#b8f4ed99';
        ctx.lineWidth = 4;
        for (let row = 0; row < 7; row += 1) {
            ctx.beginPath();
            const y = 460 + row * 38;
            for (let x = -60; x < this.width + 60; x += 80) {
                const offset = Math.sin(elapsed * 2 + row) * 18;
                ctx.moveTo(x + offset, y);
                ctx.quadraticCurveTo(x + 20 + offset, y - 7, x + 45 + offset, y);
            }
            ctx.stroke();
        }
    }

    drawGround(ctx) {
        this.drawIsland(ctx, -65, 535, 430, 205);
        this.drawIsland(ctx, 920, 525, 440, 210);
    }

    drawIsland(ctx, x, y, width, height) {
        ctx.fillStyle = '#59341f';
        ctx.beginPath();
        ctx.roundRect(x, y, width, height, 28);
        ctx.fill();

        ctx.fillStyle = '#7e4b28';
        for (let px = x + 25; px < x + width; px += 52) {
            ctx.beginPath();
            ctx.arc(px, y + 45 + (px % 43), 7, 0, TAU);
            ctx.fill();
        }

        ctx.fillStyle = '#45b83d';
        ctx.beginPath();
        ctx.roundRect(x - 5, y - 16, width + 10, 42, 22);
        ctx.fill();

        ctx.fillStyle = '#86dc41';
        for (let px = x; px < x + width; px += 18) {
            ctx.beginPath();
            ctx.moveTo(px, y);
            ctx.lineTo(px + 8, y - 24 - (px % 11));
            ctx.lineTo(px + 14, y);
            ctx.fill();
        }
    }

    drawTarget(ctx) {
        ctx.fillStyle = '#75401f';
        ctx.fillRect(1100, 405, 18, 130);
        ctx.fillRect(1190, 405, 18, 130);
        ctx.fillRect(1074, 405, 160, 18);
        ctx.fillStyle = '#bb6c31';
        ctx.fillRect(1090, 384, 128, 20);

        ctx.save();
        ctx.translate(1160, 352);
        ['#f4434c', '#fff7dd', '#f4434c', '#fff7dd', '#f4434c'].forEach((color, index) => {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(0, 0, 58 - index * 11, 0, TAU);
            ctx.fill();
        });
        ctx.restore();
    }

    drawDuck(ctx, duck) {
        if (this.isAssetReady('ducks')) {
            this.drawDuckSprite(ctx, duck);
            return;
        }

        ctx.save();
        ctx.translate(duck.x, duck.y);
        ctx.rotate(duck.rotation + Math.sin(duck.age * 2) * .025);
        ctx.scale(duck.direction, 1);

        const flashing = duck.hitFlash > 0 && Math.floor(duck.hitFlash * 45) % 2 === 0;
        ctx.fillStyle = flashing ? '#ffffff' : duck.bodyColor;
        ctx.strokeStyle = '#173044';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.ellipse(0, 20, 50, 33, 0, 0, TAU);
        ctx.fill();
        ctx.stroke();

        ctx.save();
        ctx.rotate(duck.wingAngle);
        ctx.fillStyle = flashing ? '#ffffff' : duck.wingColor;
        ctx.beginPath();
        ctx.ellipse(-10, 22, 34, 17, -.3, 0, TAU);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        ctx.fillStyle = flashing ? '#ffffff' : duck.headColor;
        ctx.beginPath();
        ctx.arc(38, -12, 28, 0, TAU);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(47, -19, 7, 0, TAU);
        ctx.fill();
        ctx.fillStyle = '#172633';
        if (duck.state === 'falling') {
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(44, -22);
            ctx.lineTo(51, -16);
            ctx.moveTo(51, -22);
            ctx.lineTo(44, -16);
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.arc(49, -19, 3, 0, TAU);
            ctx.fill();
        }

        if (duck.type === 'red' && duck.state === 'flying') {
            ctx.strokeStyle = '#5e1517';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(38, -30);
            ctx.lineTo(54, -25);
            ctx.stroke();
        }

        if (duck.type === 'king') {
            ctx.fillStyle = '#ffd438';
            ctx.strokeStyle = '#7a4810';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(17, -34);
            ctx.lineTo(20, -60);
            ctx.lineTo(31, -46);
            ctx.lineTo(41, -64);
            ctx.lineTo(50, -44);
            ctx.lineTo(61, -57);
            ctx.lineTo(62, -32);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }

        ctx.fillStyle = '#ffbd2e';
        ctx.beginPath();
        ctx.moveTo(62, -12);
        ctx.lineTo(91, -4);
        ctx.lineTo(63, 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        if (duck.type === 'golden') {
            ctx.fillStyle = '#fff7a1';
            ctx.shadowColor = '#ffd438';
            ctx.shadowBlur = 10;
            for (let index = 0; index < 4; index += 1) {
                const sparkleAngle = duck.age * 1.8 + index * (TAU / 4);
                const sparkleX = Math.cos(sparkleAngle) * 68;
                const sparkleY = Math.sin(sparkleAngle) * 42;
                ctx.beginPath();
                ctx.arc(sparkleX, sparkleY, 3, 0, TAU);
                ctx.fill();
            }
            ctx.shadowBlur = 0;
        }

        if (duck.maxHealth > 1 && duck.state === 'flying') {
            const healthWidth = 72;
            ctx.fillStyle = '#08273d';
            ctx.beginPath();
            ctx.roundRect(-36, -55, healthWidth, 10, 5);
            ctx.fill();
            ctx.fillStyle = duck.health / duck.maxHealth > .5 ? '#65df45' : '#ff5a48';
            ctx.beginPath();
            ctx.roundRect(-33, -52, 66 * Math.max(0, duck.health / duck.maxHealth), 4, 2);
            ctx.fill();
        }

        if (duck.state === 'falling') {
            ctx.fillStyle = '#fff8dfdd';
            for (let index = 0; index < 3; index += 1) {
                const drift = 58 + index * 17;
                ctx.save();
                ctx.translate(-drift, -20 + index * 19);
                ctx.rotate(duck.age * (1.8 + index * .3));
                ctx.beginPath();
                ctx.ellipse(0, 0, 9, 3, 0, 0, TAU);
                ctx.fill();
                ctx.restore();
            }
        }

        ctx.restore();
    }

    drawDuckSprite(ctx, duck) {
        const wingIsUp = Math.sin(duck.age * 9) > 0;
        const atlas = wingIsUp && this.isAssetReady('ducksUp')
            ? this.assets.ducksUp
            : this.assets.ducks;
        const spriteIndex = {
            common: 0,
            blue: 1,
            red: 2,
            purple: 3,
            golden: 4,
            king: 5,
        }[duck.type] ?? 0;
        const sourceWidth = atlas.naturalWidth / 3;
        const sourceHeight = atlas.naturalHeight / 2;
        const sourceX = (spriteIndex % 3) * sourceWidth;
        const sourceY = Math.floor(spriteIndex / 3) * sourceHeight;
        const spriteSize = 132 * duck.size;

        ctx.save();
        ctx.translate(duck.x, duck.y);
        ctx.rotate(duck.rotation + Math.sin(duck.age * 2) * .025);
        ctx.scale(duck.direction, 1);
        ctx.filter = duck.hitFlash > 0 ? 'brightness(1.8) saturate(.35)' : 'none';
        ctx.drawImage(
            atlas,
            sourceX,
            sourceY,
            sourceWidth,
            sourceHeight,
            -spriteSize * .5,
            -spriteSize * .56,
            spriteSize,
            spriteSize,
        );
        ctx.filter = 'none';

        if (duck.maxHealth > 1 && duck.state === 'flying') {
            const healthWidth = 72;
            ctx.fillStyle = '#08273d';
            ctx.beginPath();
            ctx.roundRect(-36, -spriteSize * .48, healthWidth, 10, 5);
            ctx.fill();
            ctx.fillStyle = duck.health / duck.maxHealth > .5 ? '#65df45' : '#ff5a48';
            ctx.beginPath();
            ctx.roundRect(-33, -spriteSize * .48 + 3, 66 * Math.max(0, duck.health / duck.maxHealth), 4, 2);
            ctx.fill();
        }

        if (duck.state === 'falling') {
            ctx.fillStyle = '#fff8dfdd';
            for (let index = 0; index < 3; index += 1) {
                const drift = 62 + index * 17;
                ctx.save();
                ctx.translate(-drift, -18 + index * 19);
                ctx.rotate(duck.age * (1.8 + index * .3));
                ctx.beginPath();
                ctx.ellipse(0, 0, 9, 3, 0, 0, TAU);
                ctx.fill();
                ctx.restore();
            }
        }
        ctx.restore();
    }

    drawArcher(ctx, archer, bow, bowLevel) {
        if (this.isAssetReady('archer') && this.isAssetReady('bows')) {
            this.drawArcherSprite(ctx, archer, bow, bowLevel);
            return;
        }

        const recoilOffset = Math.sin((archer.recoil / .16) * Math.PI) * 8;
        const origin = { x: archer.x - recoilOffset, y: archer.renderY };
        const angle = archer.aimAngle;
        const aiming = archer.isAiming;

        ctx.save();
        ctx.translate(origin.x, origin.y);

        ctx.strokeStyle = '#172b35';
        ctx.lineCap = 'round';
        ctx.lineWidth = 16;
        ctx.beginPath();
        ctx.moveTo(-15, 52);
        ctx.lineTo(-24, 105);
        ctx.moveTo(14, 52);
        ctx.lineTo(28, 105);
        ctx.stroke();

        ctx.fillStyle = '#317f49';
        ctx.strokeStyle = '#172b35';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.roundRect(-35, -24, 72, 90, 24);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#f2bd86';
        ctx.beginPath();
        ctx.arc(0, -62, 39, 0, TAU);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#583320';
        ctx.beginPath();
        ctx.arc(-6, -76, 40, Math.PI, TAU);
        ctx.lineTo(36, -73);
        ctx.quadraticCurveTo(18, -118, -5, -104);
        ctx.quadraticCurveTo(-28, -120, -42, -81);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#172b35';
        if (archer.blink > .65) {
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(9, -62);
            ctx.lineTo(17, -62);
            ctx.moveTo(-17, -62);
            ctx.lineTo(-9, -62);
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.arc(13, -62, 4, 0, TAU);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(-13, -62, 4, 0, TAU);
            ctx.fill();
        }

        ctx.save();
        ctx.translate(25, -9);
        ctx.rotate(aiming ? angle : -.18);
        ctx.strokeStyle = bow.color;
        ctx.lineWidth = 8 + Math.min(bowLevel, 5);
        if (bowLevel >= 3) {
            ctx.shadowColor = bow.color;
            ctx.shadowBlur = Math.min(18, 7 + bowLevel);
        }
        ctx.beginPath();
        ctx.arc(25, 0, 55, -1.25, 1.25);
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.fillStyle = bowLevel === 1 ? '#5b301a' : bow.color;
        ctx.strokeStyle = '#172b35';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(15, -13, 18, 26, 7);
        ctx.fill();
        ctx.stroke();

        if (bowLevel >= 2) {
            ctx.fillStyle = bowLevel === 2 ? '#e8f7ff' : '#fff3a5';
            [-1.05, 1.05].forEach((arcAngle) => {
                const ornamentX = 25 + Math.cos(arcAngle) * 55;
                const ornamentY = Math.sin(arcAngle) * 55;
                ctx.beginPath();
                ctx.arc(ornamentX, ornamentY, 5 + Math.min(bowLevel, 4), 0, TAU);
                ctx.fill();
            });
        }

        ctx.strokeStyle = '#f6e5c0';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(43, -52);
        ctx.quadraticCurveTo(43 - archer.charge * 34, 0, 43, 52);
        ctx.stroke();

        if (aiming && archer.state !== 'released') {
            const nockX = -18 - archer.charge * 22;
            ctx.strokeStyle = bow.arrowShaft;
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(nockX, 0);
            ctx.lineTo(84, 0);
            ctx.stroke();
            ctx.fillStyle = bow.arrowTip ?? '#eff8f6';
            ctx.beginPath();
            ctx.moveTo(84, 0);
            ctx.lineTo(69, -7);
            ctx.lineTo(72, 0);
            ctx.lineTo(69, 7);
            ctx.closePath();
            ctx.fill();
            this.drawLoadedArrowAccent(ctx, bow, nockX, 84, archer.charge);
        }
        ctx.restore();
        ctx.restore();
    }

    drawArcherSprite(ctx, archer, bow, bowLevel) {
        const recoilOffset = Math.sin((archer.recoil / .16) * Math.PI) * 8;
        const angle = archer.isAiming ? archer.aimAngle : -.16;
        const sourceWidth = this.assets.bows.naturalWidth / 4;
        const sourceHeight = this.assets.bows.naturalHeight;
        const spriteFrame = Math.min(4, Math.max(1, Number(bow.spriteFrame) || 1));

        const archerFrame = this.getArcherFrame(archer);

        ctx.save();
        ctx.translate(archer.x - recoilOffset, archer.renderY);
        ctx.drawImage(archerFrame, -91, -143, 183, 220);

        ctx.save();
        ctx.translate(73, -45);
        ctx.rotate(angle);
        if (bowLevel >= 3) {
            ctx.shadowColor = bow.color;
            ctx.shadowBlur = Math.min(20, 8 + bowLevel);
        }
        ctx.save();
        ctx.scale(-1, 1);
        ctx.filter = bow.spriteFilter ?? 'none';
        ctx.drawImage(
            this.assets.bows,
            (spriteFrame - 1) * sourceWidth,
            0,
            sourceWidth,
            sourceHeight,
            -38,
            -64,
            76,
            128,
        );
        ctx.restore();
        ctx.shadowBlur = 0;

        if (archer.isAiming && archer.state !== 'released') {
            const nockX = -18 - archer.charge * 42;
            ctx.strokeStyle = '#f6e5c0';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-17, -51);
            ctx.lineTo(nockX, 0);
            ctx.lineTo(-17, 51);
            ctx.stroke();

            ctx.strokeStyle = bow.arrowShaft;
            ctx.lineWidth = 4;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(nockX, 0);
            ctx.lineTo(79, 0);
            ctx.stroke();
            ctx.fillStyle = bow.arrowTip ?? '#eff8f6';
            ctx.beginPath();
            ctx.moveTo(86, 0);
            ctx.lineTo(72, -7);
            ctx.lineTo(75, 0);
            ctx.lineTo(72, 7);
            ctx.closePath();
            ctx.fill();
            this.drawLoadedArrowAccent(ctx, bow, nockX, 86, archer.charge);
        }
        ctx.restore();
        ctx.restore();
    }

    getArcherFrame(archer) {
        if (archer.state !== 'drawing') {
            return this.assets.archer;
        }

        if (archer.charge < .46 && this.isAssetReady('archerPreparing')) {
            return this.assets.archerPreparing;
        }

        if (archer.charge < .76 && this.isAssetReady('archerDrawing')) {
            return this.assets.archerDrawing;
        }

        return this.isAssetReady('archerFullDraw')
            ? this.assets.archerFullDraw
            : this.assets.archer;
    }

    drawLoadedArrowAccent(ctx, bow, nockX, tipX, phase) {
        const arrowStyle = {
            visualEffect: bow.arrowVisual ?? 'wood',
            color: bow.color,
            accentColor: bow.arrowAccent ?? bow.arrowTip ?? '#ffffff',
        };

        ctx.save();
        ctx.fillStyle = arrowStyle.color;
        ctx.beginPath();
        ctx.moveTo(nockX + 4, 0);
        ctx.lineTo(nockX - 10, -6);
        ctx.lineTo(nockX - 6, 0);
        ctx.lineTo(nockX - 10, 6);
        ctx.closePath();
        ctx.fill();
        this.drawArrowAccent(ctx, arrowStyle, tipX - 2, phase, .72);
        ctx.restore();
    }

    drawArrow(ctx, arrow) {
        ctx.save();
        ctx.translate(arrow.x, arrow.y);
        ctx.rotate(arrow.rotation);
        ctx.lineCap = 'round';

        this.drawArrowTrail(ctx, arrow);

        const shaftWidth = arrow.visualEffect === 'iron' ? 5.5
            : arrow.visualEffect === 'hunter' ? 3.2 : 4;
        ctx.strokeStyle = arrow.shaftColor;
        ctx.lineWidth = shaftWidth;
        ctx.beginPath();
        ctx.moveTo(-35, 0);
        ctx.lineTo(24, 0);
        ctx.stroke();

        ctx.fillStyle = arrow.tipColor;
        ctx.strokeStyle = arrow.visualEffect === 'iron' ? '#26343d' : '#344553';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(arrow.visualEffect === 'iron' ? 39 : 35, 0);
        ctx.lineTo(22, arrow.visualEffect === 'iron' ? -8 : -6);
        ctx.lineTo(22, arrow.visualEffect === 'iron' ? 8 : 6);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = arrow.color;
        ctx.beginPath();
        ctx.moveTo(-34, 0);
        ctx.lineTo(-48, -8);
        ctx.lineTo(-42, 0);
        ctx.lineTo(-48, 8);
        ctx.closePath();
        ctx.fill();

        this.drawArrowAccent(ctx, arrow, 32, arrow.age, 1);
        ctx.restore();
    }

    drawArrowTrail(ctx, arrow) {
        const pulse = Math.sin(arrow.age * 24);
        ctx.save();
        ctx.globalAlpha = .62;
        ctx.shadowColor = arrow.color;
        ctx.shadowBlur = 10;

        switch (arrow.visualEffect) {
            case 'wood':
                ctx.strokeStyle = '#c58a4d88';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(-58, 0);
                ctx.lineTo(-39, 0);
                ctx.stroke();
                break;
            case 'reinforced':
                ctx.strokeStyle = '#dff7ff';
                ctx.lineWidth = 2;
                [-5, 0, 5].forEach((offset, index) => {
                    ctx.beginPath();
                    ctx.moveTo(-82 + index * 7, offset);
                    ctx.lineTo(-40, offset * .35);
                    ctx.stroke();
                });
                break;
            case 'hunter':
                ctx.strokeStyle = '#7ed957';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(-76, -3);
                ctx.quadraticCurveTo(-58, -8 + pulse * 2, -38, 0);
                ctx.stroke();
                break;
            case 'iron':
                ctx.strokeStyle = '#c7d2d8';
                ctx.lineWidth = 6;
                ctx.beginPath();
                ctx.moveTo(-67, 0);
                ctx.lineTo(-38, 0);
                ctx.stroke();
                break;
            case 'fire':
                ['#ff3d16', '#ff9f1c', '#ffe45c'].forEach((color, index) => {
                    ctx.fillStyle = color;
                    ctx.beginPath();
                    ctx.moveTo(-37 - index * 8, 0);
                    ctx.quadraticCurveTo(-51 - index * 10, -9 + pulse * 3, -72 - index * 7, 0);
                    ctx.quadraticCurveTo(-51 - index * 10, 9 - pulse * 3, -37 - index * 8, 0);
                    ctx.fill();
                });
                break;
            case 'ice':
                ctx.fillStyle = '#dffcff';
                for (let index = 0; index < 4; index += 1) {
                    const x = -43 - index * 13;
                    const size = 3 + (index % 2);
                    ctx.save();
                    ctx.translate(x, Math.sin(arrow.age * 13 + index) * 5);
                    ctx.rotate(Math.PI / 4);
                    ctx.fillRect(-size / 2, -size / 2, size, size);
                    ctx.restore();
                }
                break;
            case 'electric':
                ctx.strokeStyle = '#fff34f';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(-85, 0);
                ctx.lineTo(-73, -7 - pulse * 2);
                ctx.lineTo(-62, 5);
                ctx.lineTo(-51, -5);
                ctx.lineTo(-38, 0);
                ctx.stroke();
                break;
            case 'crystal':
                ctx.fillStyle = '#8ffbf3';
                for (let index = 0; index < 4; index += 1) {
                    ctx.save();
                    ctx.translate(-45 - index * 15, (index % 2 ? 1 : -1) * 5);
                    ctx.rotate(Math.PI / 4);
                    ctx.fillRect(-4, -4, 8, 8);
                    ctx.restore();
                }
                break;
            case 'legendary':
                ctx.strokeStyle = '#b84dff';
                ctx.lineWidth = 7;
                ctx.beginPath();
                ctx.moveTo(-92, 0);
                ctx.lineTo(-38, 0);
                ctx.stroke();
                ctx.fillStyle = '#ffe36a';
                this.drawStarPath(ctx, -68, -7 + pulse * 3, 5, 2.2, 5);
                ctx.fill();
                break;
            case 'supreme':
                ctx.strokeStyle = '#ffd447';
                ctx.lineWidth = 9;
                ctx.beginPath();
                ctx.moveTo(-100, 0);
                ctx.lineTo(-38, 0);
                ctx.stroke();
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(-95, -4);
                ctx.lineTo(-40, -1);
                ctx.stroke();
                ctx.fillStyle = '#ffffff';
                this.drawStarPath(ctx, -75, 6 + pulse * 2, 5, 2, 5);
                ctx.fill();
                break;
            default:
                break;
        }
        ctx.restore();
    }

    drawArrowAccent(ctx, arrow, tipX, phase = 0, scale = 1) {
        const pulse = 1 + Math.sin(phase * 20) * .12;
        ctx.save();
        ctx.translate(tipX, 0);
        ctx.scale(scale, scale);
        ctx.strokeStyle = arrow.accentColor;
        ctx.fillStyle = arrow.accentColor;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        switch (arrow.visualEffect) {
            case 'wood':
                ctx.strokeStyle = '#6b351b';
                ctx.lineWidth = 2;
                [-13, -8].forEach((x) => {
                    ctx.beginPath();
                    ctx.moveTo(x, -4);
                    ctx.lineTo(x, 4);
                    ctx.stroke();
                });
                break;
            case 'reinforced':
                ctx.fillRect(-16, -5, 5, 10);
                ctx.fillRect(-8, -4, 3, 8);
                break;
            case 'hunter':
                ctx.beginPath();
                ctx.ellipse(-13, -6, 7, 3, -.55, 0, TAU);
                ctx.fill();
                break;
            case 'iron':
                ctx.strokeStyle = '#ffffffaa';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(-10, -7);
                ctx.lineTo(4, 0);
                ctx.lineTo(-10, 7);
                ctx.stroke();
                break;
            case 'fire':
                ctx.shadowColor = '#ff5a1f';
                ctx.shadowBlur = 14;
                ctx.fillStyle = '#ff5a1f';
                ctx.beginPath();
                ctx.moveTo(6, 0);
                ctx.quadraticCurveTo(-2, -12 * pulse, -15, -4);
                ctx.quadraticCurveTo(-8, 0, -15, 5);
                ctx.quadraticCurveTo(-2, 11 * pulse, 6, 0);
                ctx.fill();
                ctx.fillStyle = '#ffe45c';
                ctx.beginPath();
                ctx.ellipse(-1, 0, 7, 3.5, 0, 0, TAU);
                ctx.fill();
                break;
            case 'ice':
                ctx.lineWidth = 2;
                for (let index = 0; index < 3; index += 1) {
                    ctx.rotate(Math.PI / 3);
                    ctx.beginPath();
                    ctx.moveTo(-8, 0);
                    ctx.lineTo(8, 0);
                    ctx.stroke();
                }
                break;
            case 'electric':
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(-18, -5);
                ctx.lineTo(-9, 3);
                ctx.lineTo(-2, -6);
                ctx.lineTo(7, 1);
                ctx.stroke();
                break;
            case 'crystal':
                ctx.rotate(Math.PI / 4);
                ctx.globalAlpha = .82;
                ctx.fillRect(-8, -8, 16, 16);
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.strokeRect(-8, -8, 16, 16);
                break;
            case 'legendary':
                this.drawStarPath(ctx, 0, 0, 10 * pulse, 4.5, 5);
                ctx.fill();
                break;
            case 'supreme':
                ctx.shadowColor = '#ffd447';
                ctx.shadowBlur = 16;
                ctx.strokeStyle = '#ffd447';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(0, 0, 11 * pulse, 0, TAU);
                ctx.stroke();
                ctx.fillStyle = '#ffffff';
                this.drawStarPath(ctx, 0, 0, 8, 3.5, 6);
                ctx.fill();
                break;
            default:
                break;
        }
        ctx.restore();
    }

    drawStarPath(ctx, centerX, centerY, outerRadius, innerRadius, points) {
        ctx.beginPath();
        for (let index = 0; index < points * 2; index += 1) {
            const radius = index % 2 === 0 ? outerRadius : innerRadius;
            const angle = -Math.PI / 2 + (index * Math.PI) / points;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            if (index === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
    }

    drawCharge(ctx, charge) {
        const x = 145;
        const y = 646;
        const width = 190;

        ctx.fillStyle = '#062d49dd';
        ctx.strokeStyle = '#031c2e';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.roundRect(x, y, width, 25, 13);
        ctx.fill();
        ctx.stroke();

        const meter = ctx.createLinearGradient(x, 0, x + width, 0);
        meter.addColorStop(0, '#69dd43');
        meter.addColorStop(.62, '#ffd438');
        meter.addColorStop(1, '#ff5a35');
        ctx.fillStyle = meter;
        ctx.beginPath();
        ctx.roundRect(x + 5, y + 5, (width - 10) * charge, 15, 8);
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.font = '800 17px Nunito, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('FORÇA', x + width / 2, y - 8);
    }

    drawRewardPopup(ctx, popup) {
        const progress = popup.age / 1.15;
        const scale = 1 + Math.sin(Math.min(1, progress) * Math.PI) * .12;

        ctx.save();
        ctx.translate(popup.x, popup.y);
        ctx.scale(scale, scale);
        ctx.globalAlpha = Math.max(0, 1 - progress);
        ctx.textAlign = 'center';
        ctx.lineJoin = 'round';
        ctx.font = '800 25px "Baloo 2", sans-serif';
        ctx.lineWidth = 7;
        ctx.strokeStyle = '#062d49';
        ctx.strokeText(`+${popup.points}  ● +${popup.coins}`, 0, 0);
        ctx.fillStyle = '#ffe04a';
        ctx.fillText(`+${popup.points}  ● +${popup.coins}`, 0, 0);
        ctx.restore();
    }

    drawParticle(ctx, particle) {
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);
        ctx.globalAlpha = particle.alpha;
        ctx.fillStyle = particle.color;
        ctx.strokeStyle = particle.color;

        switch (particle.shape) {
            case 'feather':
                ctx.beginPath();
                ctx.ellipse(0, 0, particle.size, particle.size * .34, -.35, 0, TAU);
                ctx.fill();
                ctx.strokeStyle = '#d9e7e8';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(-particle.size, particle.size * .25);
                ctx.lineTo(particle.size, -particle.size * .25);
                ctx.stroke();
                break;
            case 'coin':
                ctx.strokeStyle = '#b46d09';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.ellipse(0, 0, particle.size, particle.size * .75, 0, 0, TAU);
                ctx.fill();
                ctx.stroke();
                ctx.fillStyle = '#fff09a';
                ctx.beginPath();
                ctx.arc(0, 0, particle.size * .32, 0, TAU);
                ctx.fill();
                break;
            case 'drop':
                ctx.beginPath();
                ctx.ellipse(0, 0, particle.size * .55, particle.size, 0, 0, TAU);
                ctx.fill();
                break;
            case 'confetti':
                ctx.fillRect(-particle.size * .5, -particle.size * .22, particle.size, particle.size * .44);
                break;
            case 'chip':
                ctx.fillRect(-particle.size, -particle.size * .3, particle.size * 2, particle.size * .6);
                break;
            case 'metal':
                ctx.strokeStyle = particle.secondaryColor ?? '#ffffff';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(0, -particle.size);
                ctx.lineTo(particle.size * .7, 0);
                ctx.lineTo(0, particle.size);
                ctx.lineTo(-particle.size * .7, 0);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                break;
            case 'leaf':
                ctx.beginPath();
                ctx.ellipse(0, 0, particle.size, particle.size * .42, -.55, 0, TAU);
                ctx.fill();
                break;
            case 'ember':
                ctx.shadowColor = particle.color;
                ctx.shadowBlur = 9;
                ctx.beginPath();
                ctx.moveTo(0, -particle.size * 1.4);
                ctx.quadraticCurveTo(particle.size, 0, 0, particle.size);
                ctx.quadraticCurveTo(-particle.size, 0, 0, -particle.size * 1.4);
                ctx.fill();
                break;
            case 'snowflake':
                ctx.lineWidth = 1.6;
                for (let index = 0; index < 3; index += 1) {
                    ctx.rotate(Math.PI / 3);
                    ctx.beginPath();
                    ctx.moveTo(-particle.size, 0);
                    ctx.lineTo(particle.size, 0);
                    ctx.stroke();
                }
                break;
            case 'shard':
                ctx.fillStyle = particle.color;
                ctx.strokeStyle = particle.secondaryColor ?? '#ffffff';
                ctx.lineWidth = 1.2;
                ctx.beginPath();
                ctx.moveTo(0, -particle.size * 1.4);
                ctx.lineTo(particle.size * .65, particle.size);
                ctx.lineTo(-particle.size * .5, particle.size * .55);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                break;
            case 'bolt':
                ctx.shadowColor = particle.color;
                ctx.shadowBlur = 7;
                ctx.lineWidth = Math.max(2, particle.size * .35);
                ctx.beginPath();
                ctx.moveTo(-particle.size, -particle.size);
                ctx.lineTo(0, -particle.size * .2);
                ctx.lineTo(-particle.size * .3, particle.size * .15);
                ctx.lineTo(particle.size, particle.size);
                ctx.stroke();
                break;
            case 'ring':
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(0, 0, particle.size, 0, TAU);
                ctx.stroke();
                break;
            case 'star':
                ctx.shadowColor = particle.color;
                ctx.shadowBlur = 8;
                this.drawStarPath(ctx, 0, 0, particle.size, particle.size * .44, 5);
                ctx.fill();
                break;
            default:
                ctx.shadowColor = particle.color;
                ctx.shadowBlur = 7;
                ctx.beginPath();
                ctx.arc(0, 0, particle.size, 0, TAU);
                ctx.fill();
                break;
        }

        ctx.restore();
    }

    drawAimGuide(ctx, archer) {
        const startX = archer.x + Math.cos(archer.aimAngle) * 112;
        const startY = archer.renderY + Math.sin(archer.aimAngle) * 112;

        ctx.save();
        ctx.strokeStyle = '#fff9b8aa';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 13]);
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(archer.aimTarget.x, archer.aimTarget.y);
        ctx.stroke();
        ctx.restore();
    }

    drawAim(ctx, pointer) {
        ctx.save();
        ctx.translate(pointer.x, pointer.y);
        ctx.strokeStyle = '#ffffffdd';
        ctx.lineWidth = 3;
        ctx.setLineDash([7, 7]);
        ctx.beginPath();
        ctx.arc(0, 0, 26, 0, TAU);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(-36, 0);
        ctx.lineTo(-12, 0);
        ctx.moveTo(12, 0);
        ctx.lineTo(36, 0);
        ctx.moveTo(0, -36);
        ctx.lineTo(0, -12);
        ctx.moveTo(0, 12);
        ctx.lineTo(0, 36);
        ctx.stroke();
        ctx.restore();
    }
}
