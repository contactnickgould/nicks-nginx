function init() {
    connections.length = 0, data.length = 0, all.length = 0, toDevelop.length = 0;
    var t = new Connection(0, 0, 0, opts.baseSize);
    for (t.step = Connection.rootStep, connections.push(t), all.push(t), t.link(); toDevelop.length > 0;) toDevelop[0].link(), toDevelop.shift();
    animating || (animating = !0, anim())
}

function Connection(t, e, s, i) {
    this.x = t, this.y = e, this.z = s, this.size = i, this.screen = {}, this.links = [], this.probabilities = [], this.isEnd = !1, this.glowSpeed = opts.baseGlowSpeed + opts.addedGlowSpeed * Math.random()
}

function Data(t) {
    this.glowSpeed = opts.baseGlowSpeed + opts.addedGlowSpeed * Math.random(), this.speed = opts.baseSpeed + opts.addedSpeed * Math.random(), this.screen = {}, this.setConnection(t)
}

function squareDist(t, e) {
    var s = e.x - t.x,
        i = e.y - t.y,
        n = e.z - t.z;
    return s * s + i * i + n * n
}

function anim() {
    window.requestAnimationFrame(anim), ctx.globalCompositeOperation = "source-over", ctx.fillStyle = opts.repaintColor, ctx.fillRect(0, 0, w, h), ++tick;
    var t = tick * opts.rotVelX,
        e = tick * opts.rotVelY;
    if (cosX = Math.cos(t), sinX = Math.sin(t), cosY = Math.cos(e), sinY = Math.sin(e), data.length < connections.length * opts.dataToConnections) {
        var s = new Data(connections[0]);
        data.push(s), all.push(s)
    }
    ctx.globalCompositeOperation = "lighter", ctx.beginPath(), ctx.lineWidth = opts.wireframeWidth, ctx.strokeStyle = opts.wireframeColor, all.map(function (t) {
        t.step()
    }), ctx.stroke(), ctx.globalCompositeOperation = "source-over", all.sort(function (t, e) {
        return e.screen.z - t.screen.z
    }), all.map(function (t) {
        t.draw()
    })
}
var w = c.width = window.innerWidth,
    h = c.height = window.innerHeight,
    ctx = c.getContext("2d"),
    opts = {
        range: 300,
        baseConnections: 50,
        addedConnections: 20,
        baseSize: .55,
        minSize: .2,
        dataToConnectionSize: .7,
        sizeMultiplier: .7,
        allowedDist: 10,
        baseDist: 40,
        addedDist: 30,
        connectionAttempts: 10,
        dataToConnections: 5,
        baseSpeed: .01,
        addedSpeed: .01,
        baseGlowSpeed: .001,
        addedGlowSpeed: .005,
        rotVelX: .0005,
        rotVelY: .0002,
        repaintColor: "rgba(0,0,0,1)",
        connectionColor: "rgba(254,0,0,0.5)",
        rootColor: "rgba(254,0,100,0)",
        endColor: "rgba(155,0,100,0.5)",
        dataColor: "rgba(0,100,150,.01)",
        wireframeWidth: .1,
        wireframeColor: "rgba(0,0,0,.01)",
        depth: 110,
        focalLength: 500,
        vanishPoint: {
            x: w / 2,
            y: h / 2,
        }
    }
    squareRange = opts.range * opts.range,
    squareAllowed = opts.allowedDist * opts.allowedDist,
    mostDistant = opts.depth + opts.range,
    sinX = sinY = 0,
    cosX = cosY = 0,
    connections = [],
    toDevelop = [],
    data = [],
    all = [],
    tick = 0,
    totalProb = 0,
    animating = !1,
    Tau = 2 * Math.PI;
ctx.fillStyle = "#ccc", ctx.fillRect(0, 0, w, h), ctx.fillStyle = "#ccc", ctx.font = "50px Verdana", ctx.fillText("Calculating Nodes", w / 2 - ctx.measureText("Calculating Nodes").width / 2, h / 2 - 15), window.setTimeout(init, 5), Connection.prototype.link = function () {
    if (this.size < opts.minSize) return this.isEnd = !0;
    for (var i, n, o, h, a, c, r, p, d, t = [], e = opts.baseConnections + Math.random() * opts.addedConnections | 0, s = opts.connectionAttempts, l = {}; t.length < e && --s > 0;)
        if (i = Math.random() * Math.PI, n = Math.random() * Tau, o = opts.baseDist + opts.addedDist * Math.random(), h = Math.cos(i), a = Math.sin(i), c = Math.cos(n), r = Math.sin(n), l.x = this.x + o * h * r, l.y = this.y + o * a * r, l.z = this.z + o * c, l.x * l.x + l.y * l.y + l.z * l.z < squareRange) {
            p = !0, d = !0;
            for (var x = 0; x < connections.length; ++x) squareDist(l, connections[x]) < squareAllowed && (p = !1);
            if (p)
                for (var x = 0; x < t.length; ++x) squareDist(l, t[x]) < squareAllowed && (d = !1);
            p && d && t.push({
                x: l.x,
                y: l.y,
                z: l.z
            })
        } if (0 === t.length) this.isEnd = !0;
    else {
        for (var x = 0; x < t.length; ++x) {
            var l = t[x],
                f = new Connection(l.x, l.y, l.z, this.size * opts.sizeMultiplier);
            this.links[x] = f, all.push(f), connections.push(f)
        }
        for (var x = 0; x < this.links.length; ++x) toDevelop.push(this.links[x])
    }
}, Connection.prototype.step = function () {
    this.setScreen(), this.screen.color = (this.isEnd ? opts.endColor : opts.connectionColor).replace("light", 30 + tick * this.glowSpeed % 30).replace("alp", .2 + .8 * (1 - this.screen.z / mostDistant));
    for (var t = 0; t < this.links.length; ++t) ctx.moveTo(this.screen.x, this.screen.y), ctx.lineTo(this.links[t].screen.x, this.links[t].screen.y)
}, Connection.rootStep = function () {
    this.setScreen(), this.screen.color = opts.rootColor.replace("light", 30 + tick * this.glowSpeed % 30).replace("alp", .8 * (1 - this.screen.z / mostDistant));
    for (var t = 0; t < this.links.length; ++t) ctx.moveTo(this.screen.x, this.screen.y), ctx.lineTo(this.links[t].screen.x, this.links[t].screen.y)
}, Connection.prototype.draw = function () {
    ctx.fillStyle = this.screen.color, ctx.beginPath(), ctx.arc(this.screen.x, this.screen.y, this.screen.scale * this.size, 0, Tau), ctx.fill()
}, Data.prototype.reset = function () {
    this.setConnection(connections[0]), this.ended = 2
}, Data.prototype.step = function () {
    this.proportion += this.speed, this.proportion < 1 ? (this.x = this.ox + this.dx * this.proportion, this.y = this.oy + this.dy * this.proportion, this.z = this.oz + this.dz * this.proportion, this.size = (this.os + this.ds * this.proportion) * opts.dataToConnectionSize) : this.setConnection(this.nextConnection), this.screen.lastX = this.screen.x, this.screen.lastY = this.screen.y, this.setScreen(), this.screen.color = opts.dataColor.replace("light", 40 + tick * this.glowSpeed % 50).replace("alp", .2 + .6 * (1 - this.screen.z / mostDistant))
}, Data.prototype.draw = function () {
    return this.ended ? --this.ended : (ctx.beginPath(), ctx.strokeStyle = this.screen.color, ctx.lineWidth = this.size * this.screen.scale, ctx.moveTo(this.screen.lastX, this.screen.lastY), ctx.lineTo(this.screen.x, this.screen.y), void ctx.stroke())
}, Data.prototype.setConnection = function (t) {
    t.isEnd ? this.reset() : (this.connection = t, this.nextConnection = t.links[t.links.length * Math.random() | 0], this.ox = t.x, this.oy = t.y, this.oz = t.z, this.os = t.size, this.nx = this.nextConnection.x, this.ny = this.nextConnection.y, this.nz = this.nextConnection.z, this.ns = this.nextConnection.size, this.dx = this.nx - this.ox, this.dy = this.ny - this.oy, this.dz = this.nz - this.oz, this.ds = this.ns - this.os, this.proportion = 0)
}, Connection.prototype.setScreen = Data.prototype.setScreen = function () {
    var t = this.x,
        e = this.y,
        s = this.z,
        i = e;
    e = e * cosX - s * sinX, s = s * cosX + i * sinX;
    var n = s;
    s = s * cosY - t * sinY, t = t * cosY + n * sinY, this.screen.z = s, s += opts.depth, this.screen.scale = opts.focalLength / s, this.screen.x = opts.vanishPoint.x + t * this.screen.scale, this.screen.y = opts.vanishPoint.y + e * this.screen.scale
}, window.addEventListener("resize", function () {
    opts.vanishPoint.x = (w = c.width = window.innerWidth) / 1, opts.vanishPoint.y = (h = c.height = window.innerHeight) / 1, ctx.fillRect(0, 0, w, h)
})
