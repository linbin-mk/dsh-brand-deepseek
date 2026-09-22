import z from "@deepseek-ai/schemastery";
//#region src/index.ts
/** Config schema; the defaults match the plugin's shipped look. */
const Config = z.object({
	enabled: z.boolean().default(true).volatile(),
	hero: z.boolean().default(true).volatile(),
	trajectoryTab: z.boolean().default(true).volatile(),
	sessionLogButton: z.boolean().default(true).volatile(),
	color: z.string().default("#4176e6").volatile()
});
/**
* Host plugin body: declare this instance's settings presentation. The client
* ships the Settings page, so the registry generates none of its own.
* @param ctx - host plugin context.
*/
function apply(ctx) {
	ctx.inject(["settings"], (child) => {
		child.effect(() => child.settings.configure({ auto: false }, ctx.fiber));
	});
}
//#endregion
export { Config, apply };
