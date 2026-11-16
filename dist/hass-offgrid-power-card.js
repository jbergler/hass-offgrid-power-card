// node_modules/@lit/reactive-element/css-tag.js
var e = globalThis, t = e.ShadowRoot && (e.ShadyCSS === void 0 || e.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, n = Symbol(), r = /* @__PURE__ */ new WeakMap(), i = class {
	constructor(e, t, r) {
		if (this._$cssResult$ = !0, r !== n) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
		this.cssText = e, this.t = t;
	}
	get styleSheet() {
		let e = this.o, n = this.t;
		if (t && e === void 0) {
			let t = n !== void 0 && n.length === 1;
			t && (e = r.get(n)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), t && r.set(n, e));
		}
		return e;
	}
	toString() {
		return this.cssText;
	}
}, a = (e) => new i(typeof e == "string" ? e : e + "", void 0, n), o = (e, ...t) => new i(e.length === 1 ? e[0] : t.reduce((t, n, r) => t + ((e) => {
	if (!0 === e._$cssResult$) return e.cssText;
	if (typeof e == "number") return e;
	throw Error("Value passed to 'css' function must be a 'css' function result: " + e + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
})(n) + e[r + 1], e[0]), e, n), s = (n, r) => {
	if (t) n.adoptedStyleSheets = r.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
	else for (let t of r) {
		let r = document.createElement("style"), i = e.litNonce;
		i !== void 0 && r.setAttribute("nonce", i), r.textContent = t.cssText, n.appendChild(r);
	}
}, c = t ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((e) => {
	let t = "";
	for (let n of e.cssRules) t += n.cssText;
	return a(t);
})(e) : e, { is: l, defineProperty: u, getOwnPropertyDescriptor: d, getOwnPropertyNames: ee, getOwnPropertySymbols: te, getPrototypeOf: ne } = Object, f = globalThis, p = f.trustedTypes, re = p ? p.emptyScript : "", ie = f.reactiveElementPolyfillSupport, m = (e, t) => e, h = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? re : null;
				break;
			case Object:
			case Array: e = e == null ? e : JSON.stringify(e);
		}
		return e;
	},
	fromAttribute(e, t) {
		let n = e;
		switch (t) {
			case Boolean:
				n = e !== null;
				break;
			case Number:
				n = e === null ? null : Number(e);
				break;
			case Object:
			case Array: try {
				n = JSON.parse(e);
			} catch {
				n = null;
			}
		}
		return n;
	}
}, g = (e, t) => !l(e, t), _ = {
	attribute: !0,
	type: String,
	converter: h,
	reflect: !1,
	useDefault: !1,
	hasChanged: g
};
Symbol.metadata ??= Symbol("metadata"), f.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var v = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = _) {
		if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
			let n = Symbol(), r = this.getPropertyDescriptor(e, n, t);
			r !== void 0 && u(this.prototype, e, r);
		}
	}
	static getPropertyDescriptor(e, t, n) {
		let { get: r, set: i } = d(this.prototype, e) ?? {
			get() {
				return this[t];
			},
			set(e) {
				this[t] = e;
			}
		};
		return {
			get: r,
			set(t) {
				let a = r?.call(this);
				i?.call(this, t), this.requestUpdate(e, a, n);
			},
			configurable: !0,
			enumerable: !0
		};
	}
	static getPropertyOptions(e) {
		return this.elementProperties.get(e) ?? _;
	}
	static _$Ei() {
		if (this.hasOwnProperty(m("elementProperties"))) return;
		let e = ne(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(m("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(m("properties"))) {
			let e = this.properties, t = [...ee(e), ...te(e)];
			for (let n of t) this.createProperty(n, e[n]);
		}
		let e = this[Symbol.metadata];
		if (e !== null) {
			let t = litPropertyMetadata.get(e);
			if (t !== void 0) for (let [e, n] of t) this.elementProperties.set(e, n);
		}
		this._$Eh = /* @__PURE__ */ new Map();
		for (let [e, t] of this.elementProperties) {
			let n = this._$Eu(e, t);
			n !== void 0 && this._$Eh.set(n, e);
		}
		this.elementStyles = this.finalizeStyles(this.styles);
	}
	static finalizeStyles(e) {
		let t = [];
		if (Array.isArray(e)) {
			let n = new Set(e.flat(1 / 0).reverse());
			for (let e of n) t.unshift(c(e));
		} else e !== void 0 && t.push(c(e));
		return t;
	}
	static _$Eu(e, t) {
		let n = t.attribute;
		return !1 === n ? void 0 : typeof n == "string" ? n : typeof e == "string" ? e.toLowerCase() : void 0;
	}
	constructor() {
		super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
	}
	_$Ev() {
		this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
	}
	addController(e) {
		(this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
	}
	removeController(e) {
		this._$EO?.delete(e);
	}
	_$E_() {
		let e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
		for (let n of t.keys()) this.hasOwnProperty(n) && (e.set(n, this[n]), delete this[n]);
		e.size > 0 && (this._$Ep = e);
	}
	createRenderRoot() {
		let e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
		return s(e, this.constructor.elementStyles), e;
	}
	connectedCallback() {
		this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
	}
	enableUpdating(e) {}
	disconnectedCallback() {
		this._$EO?.forEach((e) => e.hostDisconnected?.());
	}
	attributeChangedCallback(e, t, n) {
		this._$AK(e, n);
	}
	_$ET(e, t) {
		let n = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, n);
		if (r !== void 0 && !0 === n.reflect) {
			let i = (n.converter?.toAttribute === void 0 ? h : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? h : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? g)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
			this.C(e, t, n);
		}
		!1 === this.isUpdatePending && (this._$ES = this._$EP());
	}
	C(e, t, { useDefault: n, reflect: r, wrapped: i }, a) {
		n && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, a ?? t ?? this[e]), !0 !== i || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || n || (t = void 0), this._$AL.set(e, t)), !0 === r && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
	}
	async _$EP() {
		this.isUpdatePending = !0;
		try {
			await this._$ES;
		} catch (e) {
			Promise.reject(e);
		}
		let e = this.scheduleUpdate();
		return e != null && await e, !this.isUpdatePending;
	}
	scheduleUpdate() {
		return this.performUpdate();
	}
	performUpdate() {
		if (!this.isUpdatePending) return;
		if (!this.hasUpdated) {
			if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
				for (let [e, t] of this._$Ep) this[e] = t;
				this._$Ep = void 0;
			}
			let e = this.constructor.elementProperties;
			if (e.size > 0) for (let [t, n] of e) {
				let { wrapped: e } = n, r = this[t];
				!0 !== e || this._$AL.has(t) || r === void 0 || this.C(t, void 0, n, r);
			}
		}
		let e = !1, t = this._$AL;
		try {
			e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((e) => e.hostUpdate?.()), this.update(t)) : this._$EM();
		} catch (t) {
			throw e = !1, this._$EM(), t;
		}
		e && this._$AE(t);
	}
	willUpdate(e) {}
	_$AE(e) {
		this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
	}
	_$EM() {
		this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
	}
	get updateComplete() {
		return this.getUpdateComplete();
	}
	getUpdateComplete() {
		return this._$ES;
	}
	shouldUpdate(e) {
		return !0;
	}
	update(e) {
		this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
	}
	updated(e) {}
	firstUpdated(e) {}
};
v.elementStyles = [], v.shadowRootOptions = { mode: "open" }, v[m("elementProperties")] = /* @__PURE__ */ new Map(), v[m("finalized")] = /* @__PURE__ */ new Map(), ie?.({ ReactiveElement: v }), (f.reactiveElementVersions ??= []).push("2.1.2");
// node_modules/lit-html/lit-html.js
var y = globalThis, b = (e) => e, x = y.trustedTypes, ae = x ? x.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, S = "$lit$", C = `lit$${Math.random().toFixed(9).slice(2)}$`, w = "?" + C, oe = `<${w}>`, T = document, E = () => T.createComment(""), D = (e) => e === null || typeof e != "object" && typeof e != "function", O = Array.isArray, se = (e) => O(e) || typeof e?.[Symbol.iterator] == "function", k = "[ 	\n\f\r]", A = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, j = /-->/g, M = />/g, N = RegExp(`>|${k}(?:([^\\s"'>=/]+)(${k}*=${k}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), ce = /'/g, le = /"/g, ue = /^(?:script|style|textarea|title)$/i, de = (e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}), P = de(1), fe = de(2), F = Symbol.for("lit-noChange"), I = Symbol.for("lit-nothing"), L = /* @__PURE__ */ new WeakMap(), R = T.createTreeWalker(T, 129);
function z(e, t) {
	if (!O(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return ae === void 0 ? t : ae.createHTML(t);
}
var pe = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = A;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === A ? c[1] === "!--" ? o = j : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = N) : (ue.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = N) : o = M : o === N ? c[0] === ">" ? (o = i ?? A, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? N : c[3] === "\"" ? le : ce) : o === le || o === ce ? o = N : o === j || o === M ? o = A : (o = N, i = void 0);
		let d = o === N && e[t + 1].startsWith("/>") ? " " : "";
		a += o === A ? n + oe : l >= 0 ? (r.push(s), n.slice(0, l) + S + n.slice(l) + C + d) : n + C + (l === -2 ? t : d);
	}
	return [z(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, B = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = pe(t, n);
		if (this.el = e.createElement(l, r), R.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = R.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(S)) {
					let t = u[o++], n = i.getAttribute(e).split(C), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? he : r[1] === "?" ? ge : r[1] === "@" ? _e : U
					}), i.removeAttribute(e);
				} else e.startsWith(C) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (ue.test(i.tagName)) {
					let e = i.textContent.split(C), t = e.length - 1;
					if (t > 0) {
						i.textContent = x ? x.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], E()), R.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], E());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === w) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(C, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += C.length - 1;
				}
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = T.createElement("template");
		return n.innerHTML = e, n;
	}
};
function V(e, t, n = e, r) {
	if (t === F) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = D(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = V(e, i._$AS(e, t.values), i, r)), t;
}
var me = class {
	constructor(e, t) {
		this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
	}
	get parentNode() {
		return this._$AM.parentNode;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	u(e) {
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? T).importNode(t, !0);
		R.currentNode = r;
		let i = R.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new H(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new ve(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = R.nextNode(), a++);
		}
		return R.currentNode = T, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, H = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = I, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
	}
	get parentNode() {
		let e = this._$AA.parentNode, t = this._$AM;
		return t !== void 0 && e?.nodeType === 11 && (e = t.parentNode), e;
	}
	get startNode() {
		return this._$AA;
	}
	get endNode() {
		return this._$AB;
	}
	_$AI(e, t = this) {
		e = V(this, e, t), D(e) ? e === I || e == null || e === "" ? (this._$AH !== I && this._$AR(), this._$AH = I) : e !== this._$AH && e !== F && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? se(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== I && D(this._$AH) ? this._$AA.nextSibling.data = e : this.T(T.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = B.createElement(z(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new me(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = L.get(e.strings);
		return t === void 0 && L.set(e.strings, t = new B(e)), t;
	}
	k(t) {
		O(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(E()), this.O(E()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = b(e).nextSibling;
			b(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, U = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = I, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = I;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = V(this, e, t, 0), a = !D(e) || e !== this._$AH && e !== F, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = V(this, r[n + o], t, o), s === F && (s = this._$AH[o]), a ||= !D(s) || s !== this._$AH[o], s === I ? e = I : e !== I && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === I ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, he = class extends U {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === I ? void 0 : e;
	}
}, ge = class extends U {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== I);
	}
}, _e = class extends U {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = V(this, e, t, 0) ?? I) === F) return;
		let n = this._$AH, r = e === I && n !== I || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== I && (n === I || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, ve = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		V(this, e);
	}
}, ye = y.litHtmlPolyfillSupport;
ye?.(B, H), (y.litHtmlVersions ??= []).push("3.3.3");
var be = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new H(t.insertBefore(E(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, W = globalThis, G = class extends v {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = be(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return F;
	}
};
G._$litElement$ = !0, G.finalized = !0, W.litElementHydrateSupport?.({ LitElement: G });
var xe = W.litElementPolyfillSupport;
xe?.({ LitElement: G }), (W.litElementVersions ??= []).push("4.2.2");
// node_modules/@lit/reactive-element/decorators/custom-element.js
var Se = (e) => (t, n) => {
	n === void 0 ? customElements.define(e, t) : n.addInitializer(() => {
		customElements.define(e, t);
	});
}, Ce = {
	attribute: !0,
	type: String,
	converter: h,
	reflect: !1,
	hasChanged: g
}, we = (e = Ce, t, n) => {
	let { kind: r, metadata: i } = n, a = globalThis.litPropertyMetadata.get(i);
	if (a === void 0 && globalThis.litPropertyMetadata.set(i, a = /* @__PURE__ */ new Map()), r === "setter" && ((e = Object.create(e)).wrapped = !0), a.set(n.name, e), r === "accessor") {
		let { name: r } = n;
		return {
			set(n) {
				let i = t.get.call(this);
				t.set.call(this, n), this.requestUpdate(r, i, e, !0, n);
			},
			init(t) {
				return t !== void 0 && this.C(r, void 0, e, t), t;
			}
		};
	}
	if (r === "setter") {
		let { name: r } = n;
		return function(n) {
			let i = this[r];
			t.call(this, n), this.requestUpdate(r, i, e, !0, n);
		};
	}
	throw Error("Unsupported decorator location: " + r);
};
function K(e) {
	return (t, n) => typeof n == "object" ? we(e, t, n) : ((e, t, n) => {
		let r = t.hasOwnProperty(n);
		return t.constructor.createProperty(n, e), r ? Object.getOwnPropertyDescriptor(t, n) : void 0;
	})(e, t, n);
}
// node_modules/@lit/reactive-element/decorators/state.js
function q(e) {
	return K({
		...e,
		state: !0,
		attribute: !1
	});
}
// src/format.ts
function J(e, t, n) {
	return new Intl.NumberFormat(t, { maximumFractionDigits: n }).format(e);
}
function Y(e, t, n) {
	return new Intl.NumberFormat(t, {
		style: "unit",
		unit: n,
		unitDisplay: "long",
		maximumFractionDigits: 0
	}).format(e);
}
function Te(e, t, n) {
	return e === null ? "—" : Math.abs(e) >= 1e3 ? `${J(e / 1e3, t, 1)} kW` : `${J(e, t, n ?? +(Math.abs(e) < 100))} W`;
}
function Ee(e, t) {
	return e === null ? "—" : Math.abs(e) >= 1e3 ? `${J(e / 1e3, t, 1)} kWh` : `${J(e, t, +(Math.abs(e) < 100))} Wh`;
}
function De(e, t) {
	if (e === null) return "—";
	let n = Math.max(0, Math.round(e / 60));
	if (n < 60) return Y(n, t, "minute");
	let r = Math.floor(n / 60), i = n % 60, a = Math.floor(r / 24), o = r % 24, s = [];
	return a > 0 && s.push(Y(a, t, "day")), o > 0 && s.push(Y(o, t, "hour")), i > 0 && a === 0 && s.push(Y(i, t, "minute")), s.join(", ") || Y(0, t, "minute");
}
// src/power-system.ts
function Oe(e) {
	if (typeof e != "object" || !e) throw Error("Card configuration must be an object");
	let t = e;
	if (typeof t.solar_power_entity != "string" || t.solar_power_entity.trim() === "") throw Error("solar_power_entity must be a non-empty entity ID");
	if (typeof t.battery != "object" || t.battery === null) throw Error("battery must be an object");
	let n = t.battery;
	for (let e of ["soc", "power"]) if (typeof n[e] != "string" || n[e].trim() === "") throw Error(`battery.${e} must be a non-empty entity ID`);
	let r = n.power_positive ?? "discharging";
	if (r !== "discharging" && r !== "charging") throw Error("battery.power_positive must be 'discharging' or 'charging'");
	let i = t.flow_rate_threshold ?? 5;
	if (typeof i != "number" || !Number.isFinite(i) || i < 0) throw Error("flow_rate_threshold must be a non-negative number");
	let a = t.max_power ?? 3e3;
	if (typeof a != "number" || !Number.isFinite(a) || a <= 0) throw Error("max_power must be a positive number");
	return {
		...t,
		battery: {
			...n,
			power_positive: r
		},
		flow_rate_threshold: i,
		max_power: a
	};
}
function X(e) {
	if (!e || e.state === "unknown" || e.state === "unavailable") return null;
	let t = Number(e.state);
	return Number.isFinite(t) ? t : null;
}
function ke(e) {
	if (e?.attributes.device_class !== void 0 && e.attributes.device_class !== "power") return null;
	let t = X(e);
	if (t === null) return null;
	let n = {
		mW: .001,
		W: 1,
		kW: 1e3,
		MW: 1e6
	}, r = e?.attributes.unit_of_measurement, i = r === void 0 ? void 0 : n[r];
	return i === void 0 ? null : t * i;
}
function Ae(e) {
	if (e?.attributes.device_class !== void 0 && e.attributes.device_class !== "energy") return null;
	let t = X(e), n = {
		mWh: .001,
		Wh: 1,
		kWh: 1e3,
		MWh: 1e6
	}, r = e?.attributes.unit_of_measurement, i = r === void 0 ? void 0 : n[r];
	return t === null || i === void 0 ? null : t * i;
}
function je(e) {
	if (e?.attributes.device_class !== void 0 && e.attributes.device_class !== "duration") return null;
	let t = X(e), n = {
		ms: .001,
		s: 1,
		min: 60,
		h: 3600,
		d: 86400
	}, r = e?.attributes.unit_of_measurement, i = r === void 0 ? void 0 : n[r];
	return t === null || i === void 0 ? null : t * i;
}
function Z(e, t, n, r) {
	return e === null || e < n ? {
		direction: "stopped",
		intensity: 0
	} : {
		direction: t,
		intensity: Math.min(e / r, 1)
	};
}
function Me(e, t) {
	let n = e.flow_rate_threshold ?? 5, r = e.max_power ?? 3e3, i = ke(t[e.solar_power_entity]), a = ke(t[e.battery.power]), o = e.solar_energy_today_entity ? Ae(t[e.solar_energy_today_entity]) : null, s = e.battery.time_remaining ? je(t[e.battery.time_remaining]) : null, c = a === null ? null : a * (e.battery.power_positive === "charging" ? -1 : 1), l = X(t[e.battery.soc]), u = i === null || c === null ? null : i + c, d = c === null ? "unavailable" : c >= n ? "discharging" : c <= -n ? "charging" : "idle";
	return {
		solar: {
			watts: i,
			energyTodayWh: o,
			warning: i !== null && i < 0
		},
		battery: {
			soc: l,
			watts: c,
			timeRemainingSeconds: s,
			mode: d,
			warning: l !== null && (l < 0 || l > 100)
		},
		load: {
			watts: u,
			warning: u !== null && u < 0
		},
		flows: {
			solar: Z(i, "to-bus", n, r),
			battery: c === null ? {
				direction: "stopped",
				intensity: 0
			} : c >= n ? Z(c, "to-bus", n, r) : Z(-c, "from-bus", n, r),
			load: Z(u, "from-bus", n, r)
		}
	};
}
// \0@oxc-project+runtime@0.156.0/helpers/esm/decorate.js
function Q(e, t, n, r) {
	var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, n) : r, o;
	if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(e, t, n, r);
	else for (var s = e.length - 1; s >= 0; s--) (o = e[s]) && (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
	return i > 3 && a && Object.defineProperty(t, n, a), a;
}
// src/offgrid-power-card.ts
var $ = class extends G {
	constructor(...e) {
		super(...e), this.wide = !1, this.compact = !1;
	}
	setConfig(e) {
		this.config = Oe(e);
	}
	getCardSize() {
		return 4;
	}
	getGridOptions() {
		return {
			columns: "full",
			min_columns: 6,
			rows: "auto"
		};
	}
	connectedCallback() {
		super.connectedCallback(), this.resizeObserver = new ResizeObserver(([e]) => {
			if (!e) return;
			let t = e.contentRect.width >= 520;
			t !== this.wide && (this.wide = t);
			let n = e.contentRect.height <= 200;
			n !== this.compact && (this.compact = n);
		}), this.resizeObserver.observe(this);
	}
	disconnectedCallback() {
		this.resizeObserver?.disconnect(), super.disconnectedCallback();
	}
	render() {
		if (!this.config || !this.hass) return I;
		let e = Me(this.config, this.hass.states), t = this.hass.locale?.language ?? this.hass.language ?? navigator.language, n = e.battery.soc, r = n === null ? 0 : Math.min(100, Math.max(0, n));
		return P`
      <ha-card data-layout=${this.wide ? "wide" : "tall"} data-compact=${this.compact ? "true" : "false"} data-transparent=${this.config.transparent ? "true" : "false"}>
        ${this.config.title ? P`<div class="title">${this.config.title}</div>` : I}
        <div class="diagram" aria-label="Off-grid electrical power flow">
          ${this.renderFlows(e.flows)}

          <section
            class="node solar ${e.solar.warning ? "warning" : ""}"
            data-entity-id=${this.config.solar_power_entity}
            role="button"
            tabindex="0"
            aria-label="Show ${this.config.solar_label ?? "Solar"} details"
            @click=${this.showMoreInfo}
            @keydown=${this.handleNodeKeydown}
          >
            <div class="node-heading">
              <ha-icon icon=${this.config.solar_icon ?? "mdi:white-balance-sunny"}></ha-icon>
              <span class="label">${this.config.solar_label ?? "Solar"}</span>
              ${this.warning(e.solar.warning, "Solar power is negative")}
              <strong class="solar-value">${Te(e.solar.watts, t)}</strong>
            </div>
            ${this.config.solar_energy_today_entity ? P`<span class="secondary solar-yield">${Ee(e.solar.energyTodayWh, t)} yield today</span>` : I}
          </section>

          <div class="bus" aria-label="Power bus"></div>

          <section
            class="node battery ${e.battery.warning ? "warning" : ""}"
            data-entity-id=${this.config.battery.soc}
            role="button"
            tabindex="0"
            aria-label="Show ${this.config.battery_label ?? "Battery"} details"
            @click=${this.showMoreInfo}
            @keydown=${this.handleNodeKeydown}
          >
            <div class="node-heading">
              <ha-icon icon=${this.config.battery_icon ?? "mdi:battery"}></ha-icon>
              <span class="label">${this.config.battery_label ?? "Battery"}</span>
              ${this.warning(e.battery.warning, "Battery state of charge is outside 0–100%")}
              <strong class="soc-value">${n === null ? "—" : `${new Intl.NumberFormat(t, { maximumFractionDigits: 0 }).format(n)}%`}</strong>
            </div>
            <div class="battery-bar" role="meter" aria-label="Battery state of charge" aria-valuemin="0" aria-valuemax="100" aria-valuenow=${n ?? I}>
              <div class="battery-fill" style=${`width:${r}%`}></div>
            </div>
            ${this.config.battery.time_remaining ? P`<span class="secondary time">${De(e.battery.timeRemainingSeconds, t)} ${e.battery.mode === "charging" ? "until full" : "remaining"}</span>` : I}
          </section>

          <section class="node load ${e.load.warning ? "warning" : ""}">
            <ha-icon icon=${this.config.load_icon ?? "mdi:home-lightning-bolt"}></ha-icon>
            <div class="node-copy">
              <span class="label">${this.config.load_label ?? "Load"}</span>
              <strong>${Te(e.load.watts, t, 0)}</strong>
            </div>
            ${this.warning(e.load.warning, "Calculated consumption is negative")}
          </section>
        </div>
      </ha-card>
    `;
	}
	showMoreInfo(e) {
		let t = e.currentTarget.dataset.entityId;
		t && this.dispatchEvent(new CustomEvent("hass-more-info", {
			detail: { entityId: t },
			bubbles: !0,
			composed: !0
		}));
	}
	handleNodeKeydown(e) {
		(e.key === "Enter" || e.key === " ") && (e.preventDefault(), this.showMoreInfo(e));
	}
	warning(e, t) {
		return e ? P`<ha-icon class="warning-icon" icon="mdi:alert-circle-outline" title=${t} aria-label=${t}></ha-icon>` : I;
	}
	renderFlows(e) {
		let t = this.wide ? {
			solar: "M 22 36 L 48 36",
			battery: "M 50 78 L 50 40",
			load: "M 52 36 L 78 36"
		} : {
			solar: "M 38 18 L 38 46",
			battery: "M 38 82 L 38 54",
			load: "M 40 50 L 59 50"
		};
		return P`
      <svg class="flows" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <marker id="flow-arrow" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto-start-reverse" markerUnits="strokeWidth">
            <path d="M 0 0 L 5 2.5 L 0 5 z"></path>
          </marker>
        </defs>
        ${this.flowPath(t.solar, e.solar)}
        ${this.flowPath(t.battery, e.battery, !0)}
        ${this.flowPath(t.load, e.load)}
      </svg>
    `;
	}
	flowPath(e, t, n = !1) {
		let r = t.direction !== "stopped", i = n && t.direction === "from-bus", a = 22 - t.intensity * 12, o = (6 + a) / 10;
		return fe`
      <path class="flow-base" d=${e}></path>
      <path
        class="flow-active ${r ? "active" : ""} ${i ? "reverse" : ""}"
        d=${e}
        style=${`--flow-gap:${a}px;--flow-duration:${o}s`}
        marker-start=${r && i ? "url(#flow-arrow)" : I}
        marker-end=${r && !i ? "url(#flow-arrow)" : I}
      ></path>
    `;
	}
	static {
		this.styles = o`
    :host {
      display: block;
      height: auto;
      color: var(--primary-text-color);
      container-type: inline-size;
    }

    ha-card {
      display: block;
      width: 100%;
      min-height: 184px;
      box-sizing: border-box;
      overflow: hidden;
      background: var(--ha-card-background, var(--card-background-color));
    }

    ha-card[data-layout="wide"] {
      height: clamp(184px, 47.222cqi, min(360px, calc(100dvh - 96px)));
    }

    ha-card[data-layout="tall"] {
      height: clamp(360px, 160cqi, min(640px, calc(100dvh - 96px)));
    }

    ha-card[data-transparent="true"] {
      background: transparent;
      border: none;
      box-shadow: none;
    }

    .title {
      padding: 16px 16px 0;
      font-size: 18px;
      font-weight: 500;
    }

    .diagram {
      position: relative;
      height: 100%;
      min-height: 184px;
      box-sizing: border-box;
    }

    .title + .diagram {
      height: calc(100% - 48px);
      min-height: 136px;
    }

    ha-card[data-compact="true"] .title,
    ha-card[data-compact="true"] .secondary.time {
      display: none;
    }

    ha-card[data-compact="true"] .title + .diagram {
      height: 100%;
      min-height: 184px;
    }

    ha-card[data-compact="true"] .solar,
    ha-card[data-compact="true"] .battery {
      gap: 5px;
      padding-block: 8px;
    }

    .flows {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      overflow: visible;
      pointer-events: none;
    }

    .flow-base,
    .flow-active {
      fill: none;
      vector-effect: non-scaling-stroke;
      stroke-linecap: round;
    }

    .flow-base {
      stroke: var(--divider-color);
      stroke-width: 2;
    }

    .flow-active {
      stroke: var(--primary-color);
      stroke-width: 2.5;
      stroke-dasharray: 6px var(--flow-gap);
      opacity: 0;
    }

    .flow-active.active {
      opacity: 0.72;
      animation: flow-pulse var(--flow-duration) linear infinite;
      transition: stroke-dasharray 500ms ease, opacity 300ms ease;
    }

    .flow-active.reverse {
      animation-direction: reverse;
    }

    marker path {
      fill: var(--primary-color);
      stroke: none;
    }

    @keyframes flow-pulse {
      to { stroke-dashoffset: calc(-6px - var(--flow-gap)); }
    }

    .node {
      position: absolute;
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 112px;
      max-width: 176px;
      box-sizing: border-box;
      padding: 10px 12px;
      border: 1px solid var(--divider-color);
      border-radius: var(--ha-card-border-radius, 12px);
      background: var(--ha-card-background, var(--card-background-color));
      box-shadow: var(--ha-card-box-shadow, none);
      transform: translate(-50%, -50%);
    }

    .node[role="button"] {
      cursor: pointer;
    }

    .node[role="button"]:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }

    .node ha-icon {
      flex: 0 0 auto;
      color: var(--secondary-text-color);
      --mdc-icon-size: 25px;
    }

    .node-copy,
    .solar,
    .battery {
      flex-direction: column;
      align-items: stretch;
    }

    .node-copy {
      display: flex;
      min-width: 0;
    }

    .label,
    .secondary {
      color: var(--secondary-text-color);
      font-size: 12px;
      line-height: 1.35;
    }

    strong {
      font-size: 20px;
      font-weight: 500;
      line-height: 1.25;
      white-space: nowrap;
    }

    .solar,
    .battery {
      width: 176px;
      gap: 7px;
    }

    .node-heading {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .node-heading .label {
      flex: 1;
    }


    .battery-bar {
      width: 100%;
      height: 8px;
      overflow: hidden;
      border-radius: 999px;
      background: var(--divider-color);
    }

    .battery-fill {
      height: 100%;
      border-radius: inherit;
      background: var(--primary-color);
      transition: width 400ms ease;
    }

    .warning strong,
    .warning .secondary,
    .warning-icon {
      color: var(--warning-color, var(--state-climate-heat-color));
    }

    .warning-icon {
      --mdc-icon-size: 18px !important;
    }

    .bus {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 12px;
      height: 12px;
      border: 3px solid var(--primary-color);
      border-radius: 50%;
      background: var(--ha-card-background, var(--card-background-color));
      transform: translate(-50%, -50%);
      box-sizing: border-box;
    }

    ha-card[data-layout="wide"] .solar { left: 16%; top: 36%; }
    ha-card[data-layout="wide"] .bus { left: 50%; top: 36%; }
    ha-card[data-layout="wide"] .load { left: 84%; top: 36%; }
    ha-card[data-layout="wide"] .battery { left: 50%; top: 78%; }

    ha-card[data-layout="tall"] .solar { left: 38%; top: 13%; }
    ha-card[data-layout="tall"] .bus { left: 38%; top: 50%; }
    ha-card[data-layout="tall"] .load { left: 75%; top: 50%; }
    ha-card[data-layout="tall"] .battery { left: 38%; top: 87%; }

    @container (max-width: 390px) {
      .node { min-width: 100px; padding: 8px 10px; }
      .solar, .battery { width: 150px; }
    }

    @container (max-width: 320px) {
      .title { display: none; }
      .node { min-width: 92px; }
      .solar, .battery { width: 136px; }
      .solar .secondary { display: none; }
    }

    @media (prefers-reduced-motion: reduce) {
      .flow-active.active { animation: none; }
      .battery-fill { transition: none; }
    }
  `;
	}
};
Q([K({ attribute: !1 })], $.prototype, "hass", void 0), Q([q()], $.prototype, "config", void 0), Q([q()], $.prototype, "wide", void 0), Q([q()], $.prototype, "compact", void 0), $ = Q([Se("offgrid-power-card")], $), window.customCards = window.customCards ?? [], window.customCards.some((e) => e.type === "offgrid-power-card") || window.customCards.push({
	type: "offgrid-power-card",
	name: "Off-grid Power Card",
	description: "Solar, battery, and calculated load power flows.",
	preview: !0
});
export { $ as OffgridPowerCard };
