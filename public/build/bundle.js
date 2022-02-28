
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.4' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\components\Header.svelte generated by Svelte v3.46.4 */

    const file$2 = "src\\components\\Header.svelte";

    function create_fragment$2(ctx) {
    	let div;
    	let h1;
    	let t1;
    	let hr;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Wordle";
    			t1 = space();
    			hr = element("hr");
    			attr_dev(h1, "class", "title svelte-1bb929");
    			add_location(h1, file$2, 1, 4, 24);
    			attr_dev(div, "class", "head svelte-1bb929");
    			add_location(div, file$2, 0, 0, 0);
    			attr_dev(hr, "class", "svelte-1bb929");
    			add_location(hr, file$2, 3, 0, 63);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, hr, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(hr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const gameState = writable([
        [['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent']],	
    	[['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent']],
    	[['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent']],
    	[['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent']],
    	[['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent']],
    	[['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent'], ['', 'transparent']],
    ]);

    // export const word = writable(words[Math.floor(Math.random() * (list.length - 1))])
    const word = writable('CHANT');

    /* src\components\Keyboard.svelte generated by Svelte v3.46.4 */

    const { console: console_1 } = globals;
    const file$1 = "src\\components\\Keyboard.svelte";

    function create_fragment$1(ctx) {
    	let main;
    	let div0;
    	let p0;
    	let t1;
    	let p1;
    	let t3;
    	let p2;
    	let t5;
    	let p3;
    	let t7;
    	let p4;
    	let t9;
    	let p5;
    	let t11;
    	let p6;
    	let t13;
    	let p7;
    	let t15;
    	let p8;
    	let t17;
    	let p9;
    	let t19;
    	let div1;
    	let p10;
    	let t21;
    	let p11;
    	let t23;
    	let p12;
    	let t25;
    	let p13;
    	let t27;
    	let p14;
    	let t29;
    	let p15;
    	let t31;
    	let p16;
    	let t33;
    	let p17;
    	let t35;
    	let p18;
    	let t37;
    	let div2;
    	let p19;
    	let t39;
    	let p20;
    	let t41;
    	let p21;
    	let t43;
    	let p22;
    	let t45;
    	let p23;
    	let t47;
    	let p24;
    	let t49;
    	let p25;
    	let t51;
    	let p26;
    	let t53;
    	let p27;
    	let svg;
    	let path;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			main = element("main");
    			div0 = element("div");
    			p0 = element("p");
    			p0.textContent = "Q";
    			t1 = space();
    			p1 = element("p");
    			p1.textContent = "W";
    			t3 = space();
    			p2 = element("p");
    			p2.textContent = "E";
    			t5 = space();
    			p3 = element("p");
    			p3.textContent = "R";
    			t7 = space();
    			p4 = element("p");
    			p4.textContent = "T";
    			t9 = space();
    			p5 = element("p");
    			p5.textContent = "Y";
    			t11 = space();
    			p6 = element("p");
    			p6.textContent = "U";
    			t13 = space();
    			p7 = element("p");
    			p7.textContent = "I";
    			t15 = space();
    			p8 = element("p");
    			p8.textContent = "O";
    			t17 = space();
    			p9 = element("p");
    			p9.textContent = "P";
    			t19 = space();
    			div1 = element("div");
    			p10 = element("p");
    			p10.textContent = "A";
    			t21 = space();
    			p11 = element("p");
    			p11.textContent = "S";
    			t23 = space();
    			p12 = element("p");
    			p12.textContent = "D";
    			t25 = space();
    			p13 = element("p");
    			p13.textContent = "F";
    			t27 = space();
    			p14 = element("p");
    			p14.textContent = "G";
    			t29 = space();
    			p15 = element("p");
    			p15.textContent = "H";
    			t31 = space();
    			p16 = element("p");
    			p16.textContent = "J";
    			t33 = space();
    			p17 = element("p");
    			p17.textContent = "K";
    			t35 = space();
    			p18 = element("p");
    			p18.textContent = "L";
    			t37 = space();
    			div2 = element("div");
    			p19 = element("p");
    			p19.textContent = "ENTER";
    			t39 = space();
    			p20 = element("p");
    			p20.textContent = "Z";
    			t41 = space();
    			p21 = element("p");
    			p21.textContent = "X";
    			t43 = space();
    			p22 = element("p");
    			p22.textContent = "C";
    			t45 = space();
    			p23 = element("p");
    			p23.textContent = "V";
    			t47 = space();
    			p24 = element("p");
    			p24.textContent = "B";
    			t49 = space();
    			p25 = element("p");
    			p25.textContent = "N";
    			t51 = space();
    			p26 = element("p");
    			p26.textContent = "M";
    			t53 = space();
    			p27 = element("p");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(p0, "class", "key svelte-1h4o1hy");
    			add_location(p0, file$1, 43, 8, 1508);
    			attr_dev(p1, "class", "key svelte-1h4o1hy");
    			add_location(p1, file$1, 44, 8, 1595);
    			attr_dev(p2, "class", "key svelte-1h4o1hy");
    			add_location(p2, file$1, 45, 8, 1682);
    			attr_dev(p3, "class", "key svelte-1h4o1hy");
    			add_location(p3, file$1, 46, 8, 1769);
    			attr_dev(p4, "class", "key svelte-1h4o1hy");
    			add_location(p4, file$1, 47, 8, 1856);
    			attr_dev(p5, "class", "key svelte-1h4o1hy");
    			add_location(p5, file$1, 48, 8, 1943);
    			attr_dev(p6, "class", "key svelte-1h4o1hy");
    			add_location(p6, file$1, 49, 8, 2030);
    			attr_dev(p7, "class", "key svelte-1h4o1hy");
    			add_location(p7, file$1, 50, 8, 2117);
    			attr_dev(p8, "class", "key svelte-1h4o1hy");
    			add_location(p8, file$1, 51, 8, 2204);
    			attr_dev(p9, "class", "key svelte-1h4o1hy");
    			add_location(p9, file$1, 52, 8, 2291);
    			attr_dev(div0, "class", "row svelte-1h4o1hy");
    			attr_dev(div0, "id", "row-one");
    			add_location(div0, file$1, 42, 4, 1468);
    			attr_dev(p10, "class", "key svelte-1h4o1hy");
    			add_location(p10, file$1, 56, 8, 2428);
    			attr_dev(p11, "class", "key svelte-1h4o1hy");
    			add_location(p11, file$1, 57, 8, 2515);
    			attr_dev(p12, "class", "key svelte-1h4o1hy");
    			add_location(p12, file$1, 58, 8, 2602);
    			attr_dev(p13, "class", "key svelte-1h4o1hy");
    			add_location(p13, file$1, 59, 8, 2689);
    			attr_dev(p14, "class", "key svelte-1h4o1hy");
    			add_location(p14, file$1, 60, 8, 2776);
    			attr_dev(p15, "class", "key svelte-1h4o1hy");
    			add_location(p15, file$1, 61, 8, 2863);
    			attr_dev(p16, "class", "key svelte-1h4o1hy");
    			add_location(p16, file$1, 62, 8, 2950);
    			attr_dev(p17, "class", "key svelte-1h4o1hy");
    			add_location(p17, file$1, 63, 8, 3037);
    			attr_dev(p18, "class", "key svelte-1h4o1hy");
    			add_location(p18, file$1, 64, 8, 3124);
    			attr_dev(div1, "class", "row svelte-1h4o1hy");
    			attr_dev(div1, "id", "row-two");
    			add_location(div1, file$1, 55, 4, 2388);
    			attr_dev(p19, "class", "key svelte-1h4o1hy");
    			attr_dev(p19, "id", "enter");
    			add_location(p19, file$1, 68, 8, 3263);
    			attr_dev(p20, "class", "key svelte-1h4o1hy");
    			add_location(p20, file$1, 69, 8, 3369);
    			attr_dev(p21, "class", "key svelte-1h4o1hy");
    			add_location(p21, file$1, 70, 8, 3456);
    			attr_dev(p22, "class", "key svelte-1h4o1hy");
    			add_location(p22, file$1, 71, 8, 3543);
    			attr_dev(p23, "class", "key svelte-1h4o1hy");
    			add_location(p23, file$1, 72, 8, 3630);
    			attr_dev(p24, "class", "key svelte-1h4o1hy");
    			add_location(p24, file$1, 73, 8, 3717);
    			attr_dev(p25, "class", "key svelte-1h4o1hy");
    			add_location(p25, file$1, 74, 8, 3804);
    			attr_dev(p26, "class", "key svelte-1h4o1hy");
    			add_location(p26, file$1, 75, 8, 3891);
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "stroke-width", "2");
    			attr_dev(path, "d", "M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z");
    			add_location(path, file$1, 78, 16, 4205);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "backspace svelte-1h4o1hy");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke", "currentColor");
    			add_location(svg, file$1, 77, 12, 4075);
    			attr_dev(p27, "class", "key svelte-1h4o1hy");
    			attr_dev(p27, "id", "del");
    			add_location(p27, file$1, 76, 8, 3978);
    			attr_dev(div2, "class", "row svelte-1h4o1hy");
    			attr_dev(div2, "id", "row-three");
    			add_location(div2, file$1, 67, 4, 3221);
    			attr_dev(main, "class", "keyboard svelte-1h4o1hy");
    			add_location(main, file$1, 41, 0, 1439);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div0);
    			append_dev(div0, p0);
    			append_dev(div0, t1);
    			append_dev(div0, p1);
    			append_dev(div0, t3);
    			append_dev(div0, p2);
    			append_dev(div0, t5);
    			append_dev(div0, p3);
    			append_dev(div0, t7);
    			append_dev(div0, p4);
    			append_dev(div0, t9);
    			append_dev(div0, p5);
    			append_dev(div0, t11);
    			append_dev(div0, p6);
    			append_dev(div0, t13);
    			append_dev(div0, p7);
    			append_dev(div0, t15);
    			append_dev(div0, p8);
    			append_dev(div0, t17);
    			append_dev(div0, p9);
    			append_dev(main, t19);
    			append_dev(main, div1);
    			append_dev(div1, p10);
    			append_dev(div1, t21);
    			append_dev(div1, p11);
    			append_dev(div1, t23);
    			append_dev(div1, p12);
    			append_dev(div1, t25);
    			append_dev(div1, p13);
    			append_dev(div1, t27);
    			append_dev(div1, p14);
    			append_dev(div1, t29);
    			append_dev(div1, p15);
    			append_dev(div1, t31);
    			append_dev(div1, p16);
    			append_dev(div1, t33);
    			append_dev(div1, p17);
    			append_dev(div1, t35);
    			append_dev(div1, p18);
    			append_dev(main, t37);
    			append_dev(main, div2);
    			append_dev(div2, p19);
    			append_dev(div2, t39);
    			append_dev(div2, p20);
    			append_dev(div2, t41);
    			append_dev(div2, p21);
    			append_dev(div2, t43);
    			append_dev(div2, p22);
    			append_dev(div2, t45);
    			append_dev(div2, p23);
    			append_dev(div2, t47);
    			append_dev(div2, p24);
    			append_dev(div2, t49);
    			append_dev(div2, p25);
    			append_dev(div2, t51);
    			append_dev(div2, p26);
    			append_dev(div2, t53);
    			append_dev(div2, p27);
    			append_dev(p27, svg);
    			append_dev(svg, path);

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "keydown", /*keydown_handler*/ ctx[2], false, false, false),
    					listen_dev(p0, "click", prevent_default(/*click_handler*/ ctx[3]), false, true, false),
    					listen_dev(p1, "click", prevent_default(/*click_handler_1*/ ctx[4]), false, true, false),
    					listen_dev(p2, "click", prevent_default(/*click_handler_2*/ ctx[5]), false, true, false),
    					listen_dev(p3, "click", prevent_default(/*click_handler_3*/ ctx[6]), false, true, false),
    					listen_dev(p4, "click", prevent_default(/*click_handler_4*/ ctx[7]), false, true, false),
    					listen_dev(p5, "click", prevent_default(/*click_handler_5*/ ctx[8]), false, true, false),
    					listen_dev(p6, "click", prevent_default(/*click_handler_6*/ ctx[9]), false, true, false),
    					listen_dev(p7, "click", prevent_default(/*click_handler_7*/ ctx[10]), false, true, false),
    					listen_dev(p8, "click", prevent_default(/*click_handler_8*/ ctx[11]), false, true, false),
    					listen_dev(p9, "click", prevent_default(/*click_handler_9*/ ctx[12]), false, true, false),
    					listen_dev(p10, "click", prevent_default(/*click_handler_10*/ ctx[13]), false, true, false),
    					listen_dev(p11, "click", prevent_default(/*click_handler_11*/ ctx[14]), false, true, false),
    					listen_dev(p12, "click", prevent_default(/*click_handler_12*/ ctx[15]), false, true, false),
    					listen_dev(p13, "click", prevent_default(/*click_handler_13*/ ctx[16]), false, true, false),
    					listen_dev(p14, "click", prevent_default(/*click_handler_14*/ ctx[17]), false, true, false),
    					listen_dev(p15, "click", prevent_default(/*click_handler_15*/ ctx[18]), false, true, false),
    					listen_dev(p16, "click", prevent_default(/*click_handler_16*/ ctx[19]), false, true, false),
    					listen_dev(p17, "click", prevent_default(/*click_handler_17*/ ctx[20]), false, true, false),
    					listen_dev(p18, "click", prevent_default(/*click_handler_18*/ ctx[21]), false, true, false),
    					listen_dev(p19, "click", prevent_default(/*click_handler_19*/ ctx[22]), false, true, false),
    					listen_dev(p20, "click", prevent_default(/*click_handler_20*/ ctx[23]), false, true, false),
    					listen_dev(p21, "click", prevent_default(/*click_handler_21*/ ctx[24]), false, true, false),
    					listen_dev(p22, "click", prevent_default(/*click_handler_22*/ ctx[25]), false, true, false),
    					listen_dev(p23, "click", prevent_default(/*click_handler_23*/ ctx[26]), false, true, false),
    					listen_dev(p24, "click", prevent_default(/*click_handler_24*/ ctx[27]), false, true, false),
    					listen_dev(p25, "click", prevent_default(/*click_handler_25*/ ctx[28]), false, true, false),
    					listen_dev(p26, "click", prevent_default(/*click_handler_26*/ ctx[29]), false, true, false),
    					listen_dev(p27, "click", prevent_default(/*click_handler_27*/ ctx[30]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $gameState;
    	let $word;
    	validate_store(gameState, 'gameState');
    	component_subscribe($$self, gameState, $$value => $$invalidate(32, $gameState = $$value));
    	validate_store(word, 'word');
    	component_subscribe($$self, word, $$value => $$invalidate(33, $word = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Keyboard', slots, []);
    	let currentGuess = '';
    	let guessNumber = 0;

    	const validateGuess = guess => {
    		return true;
    	};

    	const submitGuess = guess => {
    		for (const letter in guess) {
    			if ($word.includes(letter)) {
    				if ($word[guess.indexOf(letter)] == letter) {
    					gameEls[guessNumber * 5 + guess.indexOf(letter)].style = 'background-color: #538d4e';
    					console.log('Right ', letter);
    				} else {
    					gameEls[guessNumber * 5 + guess.indexOf(letter)].style = 'background-color: #b59f3b';
    					console.log('Wrong ', letter);
    				}
    			}
    		}

    		$$invalidate(0, currentGuess = '');
    		if (guessNumber < 6) guessNumber += 1;
    	};

    	const handleLetterPressed = letter => {
    		if (letter == 'ENTER') {
    			{
    				submitGuess(currentGuess);
    			}
    		} else if (letter == 'DEL') {
    			$$invalidate(0, currentGuess = currentGuess.slice(0, -1));
    			set_store_value(gameState, $gameState[guessNumber][currentGuess.length] = '', $gameState);
    		} else if (('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ').includes(letter) && currentGuess.length < 5) {
    			$$invalidate(0, currentGuess += letter);
    			set_store_value(gameState, $gameState[guessNumber][currentGuess.length - 1] = letter, $gameState);
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Keyboard> was created with unknown prop '${key}'`);
    	});

    	const keydown_handler = e => {
    		if (('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ').includes(e.key) && currentGuess.length < 5) handleLetterPressed(e.key.toUpperCase()); else if (e.key == 'Enter') handleLetterPressed('ENTER'); else if (e.key == 'Backspace') handleLetterPressed('DEL');
    	};

    	const click_handler = () => handleLetterPressed('Q');
    	const click_handler_1 = () => handleLetterPressed('W');
    	const click_handler_2 = () => handleLetterPressed('E');
    	const click_handler_3 = () => handleLetterPressed('R');
    	const click_handler_4 = () => handleLetterPressed('T');
    	const click_handler_5 = () => handleLetterPressed('Y');
    	const click_handler_6 = () => handleLetterPressed('U');
    	const click_handler_7 = () => handleLetterPressed('I');
    	const click_handler_8 = () => handleLetterPressed('O');
    	const click_handler_9 = () => handleLetterPressed('P');
    	const click_handler_10 = () => handleLetterPressed('A');
    	const click_handler_11 = () => handleLetterPressed('S');
    	const click_handler_12 = () => handleLetterPressed('D');
    	const click_handler_13 = () => handleLetterPressed('F');
    	const click_handler_14 = () => handleLetterPressed('G');
    	const click_handler_15 = () => handleLetterPressed('H');
    	const click_handler_16 = () => handleLetterPressed('J');
    	const click_handler_17 = () => handleLetterPressed('K');
    	const click_handler_18 = () => handleLetterPressed('L');
    	const click_handler_19 = () => handleLetterPressed('ENTER');
    	const click_handler_20 = () => handleLetterPressed('Z');
    	const click_handler_21 = () => handleLetterPressed('X');
    	const click_handler_22 = () => handleLetterPressed('C');
    	const click_handler_23 = () => handleLetterPressed('V');
    	const click_handler_24 = () => handleLetterPressed('B');
    	const click_handler_25 = () => handleLetterPressed('N');
    	const click_handler_26 = () => handleLetterPressed('M');
    	const click_handler_27 = () => handleLetterPressed('DEL');

    	$$self.$capture_state = () => ({
    		gameState,
    		word,
    		currentGuess,
    		guessNumber,
    		validateGuess,
    		submitGuess,
    		handleLetterPressed,
    		$gameState,
    		$word
    	});

    	$$self.$inject_state = $$props => {
    		if ('currentGuess' in $$props) $$invalidate(0, currentGuess = $$props.currentGuess);
    		if ('guessNumber' in $$props) guessNumber = $$props.guessNumber;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		currentGuess,
    		handleLetterPressed,
    		keydown_handler,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
    		click_handler_6,
    		click_handler_7,
    		click_handler_8,
    		click_handler_9,
    		click_handler_10,
    		click_handler_11,
    		click_handler_12,
    		click_handler_13,
    		click_handler_14,
    		click_handler_15,
    		click_handler_16,
    		click_handler_17,
    		click_handler_18,
    		click_handler_19,
    		click_handler_20,
    		click_handler_21,
    		click_handler_22,
    		click_handler_23,
    		click_handler_24,
    		click_handler_25,
    		click_handler_26,
    		click_handler_27
    	];
    }

    class Keyboard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {}, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Keyboard",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.46.4 */
    const file = "src\\App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (36:4) {#each row as el}
    function create_each_block_1(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			attr_dev(p, "class", "item svelte-xmg9tu");
    			set_style(p, "background-color", /*el*/ ctx[4][1]);
    			add_location(p, file, 36, 5, 797);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$gameState*/ 1) {
    				set_style(p, "background-color", /*el*/ ctx[4][1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(36:4) {#each row as el}",
    		ctx
    	});

    	return block;
    }

    // (35:3) {#each $gameState as row}
    function create_each_block(ctx) {
    	let each_1_anchor;
    	let each_value_1 = /*row*/ ctx[1];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$gameState*/ 1) {
    				each_value_1 = /*row*/ ctx[1];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(35:3) {#each $gameState as row}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let header;
    	let t0;
    	let div1;
    	let div0;
    	let t1;
    	let div2;
    	let keyboard;
    	let current;
    	header = new Header({ $$inline: true });
    	let each_value = /*$gameState*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	keyboard = new Keyboard({ props: { gameEls: true }, $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(header.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			div2 = element("div");
    			create_component(keyboard.$$.fragment);
    			attr_dev(div0, "class", "container svelte-xmg9tu");
    			add_location(div0, file, 9, 2, 210);
    			attr_dev(div1, "class", "game svelte-xmg9tu");
    			add_location(div1, file, 8, 1, 189);
    			attr_dev(div2, "class", "keyboard-container svelte-xmg9tu");
    			add_location(div2, file, 41, 1, 893);
    			add_location(main, file, 6, 0, 162);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(header, main, null);
    			append_dev(main, t0);
    			append_dev(main, div1);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			append_dev(main, t1);
    			append_dev(main, div2);
    			mount_component(keyboard, div2, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$gameState*/ 1) {
    				each_value = /*$gameState*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(keyboard.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(keyboard.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(header);
    			destroy_each(each_blocks, detaching);
    			destroy_component(keyboard);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $gameState;
    	validate_store(gameState, 'gameState');
    	component_subscribe($$self, gameState, $$value => $$invalidate(0, $gameState = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Header, Keyboard, gameState, $gameState });
    	return [$gameState];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
