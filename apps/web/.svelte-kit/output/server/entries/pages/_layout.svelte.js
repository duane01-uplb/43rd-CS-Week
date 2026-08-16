import { i as slot, t as bind_props } from "../../chunks/server.js";
//#region src/routes/+layout.svelte
function _layout($$renderer, $$props) {
	let data = $$props["data"];
	$$renderer.push(`<nav style="padding:1rem; border-bottom:1px solid #eee;"><a href="/">Home</a> | <a href="/events">Events</a> | <a href="/admin">Admin</a></nav> <main style="padding:1rem;"><!--[-->`);
	slot($$renderer, $$props, "default", {}, null);
	$$renderer.push(`<!--]--></main>`);
	bind_props($$props, { data });
}
//#endregion
export { _layout as default };
