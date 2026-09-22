import z from "@deepseek-ai/schemastery";
//#region src/index.ts
const inject = ["settings"];
/** Settings namespace holding the persisted brand style. */
const NS = "dsh-brand-deepseek";
/** Host plugin body — registers the namespace, nothing else. */
function apply(ctx) {
	ctx.effect(() => {
		ctx.settings.register(NS, z.object({
			enabled: z.boolean().default(true),
			hero: z.boolean().default(true),
			trajectoryTab: z.boolean().default(true),
			sessionLogButton: z.boolean().default(true),
			color: z.string().default("#4176e6")
		}), { base: {
			enabled: true,
			hero: true,
			trajectoryTab: true,
			sessionLogButton: true,
			color: "#4176e6"
		} });
		return () => {};
	}, "dsh-brand-deepseek: settings namespace");
}
//#endregion
export { apply, inject };
