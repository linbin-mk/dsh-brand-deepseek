window.__ModuleLoader__.load({
	id: "@linbin-mk/dsh-brand-deepseek",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react_jsx_runtime = require("react/jsx-runtime");
		let react = require("react");
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		//#region src/client/brand.tsx
		/**
		* Official DeepSeek logo, copied verbatim from https://www.deepseek.com/
		* (header <a> mark: /html/body/div[1]/div/div[1]/div/a/svg).
		*
		* It is split into the two brand slots the sidebar exposes:
		*  - the whale mark (the `clip0_logo` group in the source SVG)
		*  - the `DeepSeek` wordmark (the letter paths in the source SVG)
		* Both fill with the plugin-managed brand color (`--dsh-brand-deepseek-color`,
		* set on the document root from the Settings → 品牌样式 page), falling back to
		* the official DeepSeek blue so the logo renders in the official color before
		* the persisted style loads.
		*/
		const WHALE_PATH = "M26.5174 3.39471C26.235 3.2567 26.1137 3.52006 25.9487 3.65346C25.8923 3.69659 25.8446 3.75294 25.7969 3.80469C25.3846 4.24516 24.9027 4.53439 24.2737 4.49989C23.3536 4.44814 22.5682 4.73737 21.8735 5.44119C21.7258 4.57349 21.2353 4.0554 20.4889 3.72304C20.0985 3.55054 19.7034 3.37746 19.4297 3.00197C19.2388 2.73459 19.1865 2.43673 19.091 2.14289C19.0301 1.96579 18.9697 1.78466 18.7656 1.75418C18.5442 1.71968 18.4574 1.90541 18.3705 2.06067C18.0232 2.69549 17.8887 3.39471 17.9019 4.10313C17.9324 5.6965 18.6051 6.96556 19.9421 7.86834C20.0939 7.97184 20.133 8.07535 20.0852 8.22658C19.9938 8.53766 19.8857 8.83955 19.7903 9.15063C19.7293 9.34901 19.6384 9.39271 19.4257 9.30588C18.692 8.9994 18.0583 8.54571 17.4982 7.99772C16.5477 7.07827 15.6881 6.06336 14.6162 5.26869C14.3644 5.08296 14.1125 4.91045 13.8521 4.746C12.7584 3.68394 13.9952 2.81164 14.2816 2.70814C14.5812 2.60003 14.3857 2.22857 13.4179 2.23317C12.4502 2.2372 11.5646 2.56151 10.4359 2.99335C10.2708 3.05832 10.0972 3.10547 9.91951 3.14457C8.8954 2.95022 7.83162 2.90709 6.72069 3.03245C4.62877 3.26533 2.95777 4.25436 1.72954 5.94261C0.254043 7.97184 -0.0932678 10.2777 0.33167 12.6824C0.778458 15.2171 2.07225 17.3153 4.06008 18.9558C6.12152 20.6567 8.49577 21.4905 11.2047 21.3306C12.8498 21.2358 14.6812 21.0155 16.7473 19.2669C17.2682 19.5262 17.8151 19.6297 18.7219 19.7074C19.4205 19.7723 20.0933 19.6729 20.6143 19.5648C21.4302 19.3923 21.3739 18.6367 21.0789 18.4981C18.6874 17.3843 19.2124 17.8374 18.7351 17.4706C19.9501 16.033 21.8063 13.4776 22.379 9.99821C22.4353 9.61409 22.5072 9.073 22.4986 8.76192C22.494 8.57216 22.5377 8.49856 22.7545 8.47671C23.3536 8.40771 23.935 8.24383 24.4692 7.94999C26.0188 7.10357 26.6439 5.71318 26.7911 4.04678C26.8129 3.79204 26.7865 3.52869 26.5174 3.39471ZM13.0143 18.3946C10.6964 16.5724 9.5722 15.9726 9.10816 15.9985C8.67402 16.0244 8.75222 16.5212 8.84768 16.8449C8.94773 17.1646 9.07768 17.3849 9.25996 17.6655C9.38589 17.8512 9.47272 18.1272 9.13404 18.3348C8.38766 18.7965 7.08985 18.1796 7.0289 18.1491C5.51833 17.2595 4.25559 16.0853 3.36546 14.4793C2.50581 12.9337 2.0067 11.2753 1.92447 9.50542C1.90262 9.07818 2.02855 8.92695 2.45406 8.84932C3.01413 8.74582 3.59144 8.72397 4.15093 8.80619C6.51656 9.15178 8.53027 10.2092 10.2185 11.8848C11.1822 12.8388 11.9114 13.979 12.6623 15.0929C13.461 16.2757 14.3201 17.4027 15.4144 18.3268C15.8008 18.6505 16.109 18.8966 16.404 19.0783C15.5144 19.1778 14.0297 19.1991 13.0143 18.3958V18.3946ZM14.1252 11.2489C14.1252 11.0591 14.277 10.9079 14.4679 10.9079C14.511 10.9079 14.5501 10.9165 14.5852 10.9292C14.6329 10.9464 14.6766 10.9723 14.7111 11.0114C14.7721 11.0718 14.8066 11.158 14.8066 11.2489C14.8066 11.4386 14.6548 11.5899 14.4639 11.5899C14.273 11.5899 14.1252 11.4386 14.1252 11.2489ZM17.5759 13.0188C17.3545 13.1096 17.1331 13.1873 16.9203 13.1959C16.5903 13.2131 16.2303 13.0791 16.0348 12.9153C15.7312 12.6605 15.5139 12.5179 15.423 12.0734C15.3839 11.8837 15.4057 11.5899 15.4402 11.4214C15.5185 11.0585 15.4316 10.8257 15.1757 10.614C14.9676 10.4415 14.7025 10.3938 14.4115 10.3938C14.3029 10.3938 14.2034 10.3461 14.1292 10.3076C14.0079 10.2472 13.9078 10.096 14.0033 9.91023C14.0338 9.84985 14.1815 9.70322 14.216 9.67734C14.6111 9.45251 15.0665 9.52612 15.488 9.6946C15.8784 9.85445 16.174 10.1477 16.5989 10.5623C17.033 11.0631 17.1112 11.2011 17.3585 11.5772C17.554 11.871 17.7317 12.1729 17.8536 12.5185C17.9272 12.7341 17.8317 12.9107 17.5759 13.0188Z";
		const WORDMARK_PATHS = [
			"M78.6784 18.6813H77.1077V16.2462H78.6784C79.6513 16.2462 80.6341 16.0037 81.2672 15.3298C81.9009 14.6559 82.14 13.6222 82.14 12.589C82.14 11.5559 81.9109 10.5222 81.2672 9.84884C80.6246 9.17496 79.6513 8.93245 78.6784 8.93245C77.7056 8.93245 76.7227 9.17496 76.0885 9.84884C75.4549 10.5227 75.2157 11.5559 75.2157 12.589V22.5899H72.4604V6.50684H75.2157V7.53106H75.7209C75.7756 7.46792 75.8304 7.41428 75.8857 7.36064C76.5752 6.73146 77.6307 6.50684 78.6684 6.50684C80.2944 6.50684 81.9193 6.91138 82.9849 8.03451C84.0499 9.15764 84.4265 10.8826 84.4265 12.5991C84.4265 14.3156 84.0404 16.0316 82.9849 17.1637C81.9288 18.2958 80.2944 18.6824 78.6784 18.6824V18.6813Z",
			"M36.7486 6.93999H38.3188V9.37511H36.7486C35.7752 9.37511 34.7929 9.61762 34.1593 10.2915C33.5256 10.9654 33.287 11.9991 33.287 13.0323C33.287 14.0654 33.5167 15.0986 34.1593 15.7725C34.8019 16.4463 35.7752 16.6888 36.7486 16.6888C37.722 16.6888 38.7049 16.4463 39.3385 15.7725C39.9722 15.0986 40.2108 14.0654 40.2108 13.0323V3.02246H42.9655V19.115H40.2108V18.0908H39.7056C39.6503 18.1534 39.5955 18.2076 39.5402 18.2612C38.8513 18.8898 37.7952 19.115 36.7576 19.115C35.1321 19.115 33.5066 18.711 32.4416 17.5879C31.3766 16.4648 31 14.7393 31 13.0233C31 11.3073 31.3856 9.5908 32.4416 8.45873C33.5066 7.3356 35.1321 6.93999 36.7486 6.93999Z",
			"M56.7855 12.8145V13.794H49.4483V11.8445H54.3151C54.2051 11.1348 53.948 10.4699 53.4887 9.98433C52.8277 9.28363 51.8079 9.03218 50.7982 9.03218C49.7886 9.03218 48.7688 9.28363 48.1078 9.98433C47.4468 10.685 47.2076 11.7545 47.2076 12.8151C47.2076 13.8756 47.4462 14.9535 48.1078 15.6452C48.7688 16.337 49.788 16.5979 50.7982 16.5979C51.8085 16.5979 52.8277 16.3465 53.4887 15.6452C53.5804 15.5463 53.6631 15.4385 53.7458 15.3306H56.4642C56.2256 16.1755 55.849 16.9393 55.2796 17.5322C54.1777 18.6911 52.479 19.1135 50.7982 19.1135C49.1175 19.1135 47.4188 18.7 46.3169 17.5322C45.215 16.3644 44.811 14.5852 44.811 12.8151C44.811 11.0449 45.2061 9.25681 46.3169 8.09792C47.4283 6.93903 49.1175 6.5166 50.7982 6.5166C52.479 6.5166 54.1777 6.93009 55.2796 8.09792C56.3904 9.26575 56.7855 11.0449 56.7855 12.8151V12.8145Z",
			"M70.6151 12.8145V13.794H63.2779V11.8445H68.1447C68.0341 11.1348 67.7776 10.4699 67.3183 9.98433C66.6573 9.28363 65.6375 9.03218 64.6278 9.03218C63.6181 9.03218 62.5984 9.28363 61.9374 9.98433C61.2763 10.685 61.0372 11.7545 61.0372 12.8151C61.0372 13.8756 61.2758 14.9535 61.9374 15.6452C62.5984 16.337 63.6181 16.5979 64.6278 16.5979C65.6375 16.5979 66.6573 16.3465 67.3183 15.6452C67.4105 15.5463 67.4927 15.4385 67.5748 15.3306H70.2938C70.0546 16.1755 69.678 16.9393 69.1086 17.5322C68.0067 18.6911 66.3081 19.1135 64.6278 19.1135C62.9476 19.1135 61.2484 18.7 60.1465 17.5322C59.0446 16.3644 58.6406 14.5852 58.6406 12.8151C58.6406 11.0449 59.0357 9.25681 60.1465 8.09792C61.2579 6.93903 62.9471 6.5166 64.6278 6.5166C66.3086 6.5166 68.0067 6.93009 69.1086 8.09792C70.22 9.26575 70.6151 11.0449 70.6151 12.8151V12.8145Z",
			"M92.2781 19.1146C93.9589 19.1146 95.657 18.8721 96.7589 18.1804C97.8607 17.4886 98.2653 16.437 98.2653 15.3949C98.2653 14.3528 97.8697 13.2922 96.7589 12.6094C95.657 11.9266 93.9583 11.6746 92.2781 11.6746C91.5612 11.6746 90.9002 11.5757 90.4319 11.3153C89.9637 11.0454 89.7893 10.6414 89.7893 10.2369C89.7893 9.83234 89.9547 9.41941 90.4319 9.15846C90.9002 8.88858 91.626 8.79917 92.3418 8.79917C93.0576 8.79917 93.7834 8.89808 94.2528 9.15846C94.721 9.42835 94.8954 9.83234 94.8954 10.2369H97.6959C97.6959 9.19422 97.3383 8.13424 96.3375 7.45142C95.3368 6.76861 93.803 6.5166 92.2786 6.5166C90.7543 6.5166 89.2211 6.75911 88.2197 7.45142C87.219 8.14318 86.8603 9.19422 86.8603 10.2369C86.8603 11.2796 87.2184 12.3395 88.2197 13.0224C89.2205 13.7052 90.7538 13.9572 92.2786 13.9572C93.0682 13.9572 93.941 14.0561 94.464 14.3165C94.9881 14.5774 95.1714 14.9903 95.1714 15.3949C95.1714 15.7994 94.9881 16.2124 94.464 16.4733C93.941 16.7337 93.1419 16.8326 92.3524 16.8326C91.5629 16.8326 90.7543 16.7337 90.2397 16.4733C89.7256 16.2129 89.5323 15.7994 89.5323 15.3949H86.2998C86.2998 16.4376 86.6943 17.4975 87.8063 18.1804C88.9171 18.8632 90.5979 19.1146 92.2786 19.1146H92.2781Z",
			"M112.094 12.8145V13.794H104.757V11.8445H109.624C109.514 11.1348 109.257 10.4699 108.798 9.98433C108.136 9.28363 107.117 9.03218 106.106 9.03218C105.095 9.03218 104.077 9.28363 103.416 9.98433C102.755 10.685 102.517 11.7545 102.517 12.8151C102.517 13.8756 102.755 14.9535 103.416 15.6452C104.077 16.337 105.097 16.5979 106.106 16.5979C107.116 16.5979 108.136 16.3465 108.798 15.6452C108.889 15.5463 108.972 15.4385 109.054 15.3306H111.772C111.533 16.1755 111.157 16.9393 110.588 17.5322C109.486 18.6911 107.787 19.1135 106.106 19.1135C104.425 19.1135 102.727 18.7 101.625 17.5322C100.524 16.3644 100.12 14.5852 100.12 12.8151C100.12 11.0449 100.515 9.25681 101.625 8.09792C102.737 6.93903 104.427 6.5166 106.106 6.5166C107.786 6.5166 109.486 6.93009 110.588 8.09792C111.699 9.26575 112.093 11.0449 112.093 12.8151L112.094 12.8145Z",
			"M125.924 12.8145V13.794H118.586V11.8445H123.453C123.344 11.1348 123.086 10.4699 122.627 9.98433C121.966 9.28363 120.947 9.03218 119.936 9.03218C118.926 9.03218 117.907 9.28363 117.246 9.98433C116.585 10.685 116.346 11.7545 116.346 12.8151C116.346 13.8756 116.585 14.9535 117.246 15.6452C117.907 16.337 118.927 16.5979 119.936 16.5979C120.946 16.5979 121.966 16.3465 122.627 15.6452C122.719 15.5463 122.801 15.4385 122.884 15.3306H125.602C125.363 16.1755 124.987 16.9393 124.418 17.5322C123.316 18.6911 121.617 19.1135 119.936 19.1135C118.256 19.1135 116.558 18.7 115.456 17.5322C114.354 16.3644 113.949 14.5852 113.949 12.8151C113.949 11.0449 114.344 9.25681 115.456 8.09792C116.566 6.93903 118.256 6.5166 119.936 6.5166C121.617 6.5166 123.315 6.93009 124.418 8.09792C125.529 9.26575 125.924 11.0449 125.924 12.8151V12.8145Z",
			"M130.524 3.02246H127.77V19.115H130.524V3.02246Z",
			"M135.227 12.4374L139.744 19.1136H136.337L131.819 12.4374L136.337 7.07324H139.744L135.227 12.4374Z"
		];
		/** Brand fill: custom color first, official DeepSeek blue as the fallback. */
		const BRAND_FILL = "var(--dsh-brand-deepseek-color, var(--ds-color-brand-medium-reverse, #4176e6))";
		/** Official DeepSeek whale mark, scaled to the host surface's requested size. */
		function BrandMark({ size, className }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
				width: size * (28 / 20.5),
				height: size,
				viewBox: "-0.5 1.5 28 20.5",
				fill: BRAND_FILL,
				preserveAspectRatio: "xMidYMid meet",
				className,
				role: "img",
				"aria-label": "DeepSeek",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: WHALE_PATH })
			});
		}
		/** Official DeepSeek wordmark, height-matched to the mark for alignment. */
		function BrandName({ size = 22, className }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
				width: size * (109 / 20),
				height: size,
				viewBox: "31 3 109 20",
				fill: BRAND_FILL,
				preserveAspectRatio: "xMidYMid meet",
				className,
				role: "img",
				"aria-label": "DeepSeek",
				children: WORDMARK_PATHS.map((d, i) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d }, i))
			});
		}
		//#endregion
		//#region src/client/hero.tsx
		/**
		* Sheet turning the hosted hero headline row into the DeepSeek look while the
		* feature is on: the row drops its fixed 34px/auto/auto grid for a centered
		* flex row, the default text spans hide, and the mark slot's hitbox box
		* dissolves so the occupant's whale + title flow directly into the row.
		* The container rule anchors on the hitbox (`:has([class*='_fishHitbox'])`),
		* the hero-headline row's own unique descendant, so the shared `.headline`
		* locals of other modules (ContextMeter, ApprovalPanel — which also render
		* inside the composer seat during a takeover) are never touched.
		*
		* The default title is hidden through every local it has shipped under: the
		* dedicated `_headlineText` span of 0.1.5-rc.1 and the `_titleGroup` wrapper
		* (title + badge) that replaced it in 0.1.5-rc.2. Each selector is a no-op on
		* the harness versions that never had that local, so both stay listed.
		*/
		const HERO_CSS = `
[data-composer-seat] [class*='_headlineText'],
[data-composer-seat] [class*='_titleGroup'],
[data-composer-seat] [class*='_previewBadge'] {
  display: none;
}
[data-composer-seat] [class*='_headline']:has([class*='_fishHitbox']) {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
[data-composer-seat] [class*='_fishHitbox'] {
  display: contents;
}
`;
		/** Title style mirroring the hosted hero headline (26/32 wt500 inherited). */
		const TITLE_STYLE = {
			fontSize: 26,
			lineHeight: "32px",
			fontWeight: 600,
			whiteSpace: "nowrap",
			color: "var(--dsw-alias-label-primary)"
		};
		/**
		* The official DeepSeek hero headline occupant: the whale mark (brand color)
		* followed by the brand title, centered by {@link HERO_CSS}.
		* @param props - host request mark size/class plus the injected locale seat.
		* @returns the whale + title row fragment.
		*/
		function HeroHeadlineMark({ size, className, t }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(BrandMark, {
				size,
				className
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				style: TITLE_STYLE,
				children: t("hero.title")
			})] });
		}
		//#endregion
		//#region src/client/stores.ts
		/**
		* Current (default) brand color: the official DeepSeek blue. Persisted style
		* falls back to it, and it is the pre-selected palette option.
		*/
		const DEFAULT_BRAND_COLOR = "#4176e6";
		/** The 10 selectable brand colors; the first is the current scheme (default). */
		const BRAND_COLORS = [
			{
				id: "official",
				value: "#4176e6",
				nameKey: "color.official"
			},
			{
				id: "deep",
				value: "#1d4ed8",
				nameKey: "color.deep"
			},
			{
				id: "sky",
				value: "#0ea5e9",
				nameKey: "color.sky"
			},
			{
				id: "emerald",
				value: "#10b981",
				nameKey: "color.emerald"
			},
			{
				id: "teal",
				value: "#0d9488",
				nameKey: "color.teal"
			},
			{
				id: "amber",
				value: "#f59e0b",
				nameKey: "color.amber"
			},
			{
				id: "orange",
				value: "#f97316",
				nameKey: "color.orange"
			},
			{
				id: "pink",
				value: "#ec4899",
				nameKey: "color.pink"
			},
			{
				id: "violet",
				value: "#8b5cf6",
				nameKey: "color.violet"
			},
			{
				id: "graphite",
				value: "#1f2937",
				nameKey: "color.graphite"
			}
		];
		function messageOf(cause) {
			return cause instanceof Error ? cause.message : String(cause);
		}
		/**
		* Module-level observable backing the Settings → 品牌样式 page, mirroring the
		* workspace-prompt plugin's pattern: `settings.section` renders through the
		* root-scoped slot machinery, so the apply half (which owns `ctx`) writes the
		* read/write handlers here and the section reads state via React's
		* {@link useSyncExternalStore}.
		*/
		var BrandStyleObservable = class {
			listeners = /* @__PURE__ */ new Set();
			state = {
				enabled: true,
				hero: true,
				trajectoryTab: true,
				sessionLogButton: true,
				color: DEFAULT_BRAND_COLOR,
				writable: false,
				busy: false,
				error: null
			};
			/** Set by the apply half at activation; undefined only before first activation. */
			handlers;
			getSnapshot = () => this.state;
			subscribe = (listener) => {
				this.listeners.add(listener);
				return () => {
					this.listeners.delete(listener);
				};
			};
			/**
			* Adopt one Host-accepted style without a write (the first read, a write
			* folded back, or an edit made from elsewhere). In-flight or failed
			* operations keep their own status, so an accepted push never masks an error.
			* @param state - accepted brand-style values.
			* @param writable - whether the Host document accepts writes from this page.
			*/
			adopt = (state, writable) => {
				this.state = {
					...this.state,
					...state,
					writable
				};
				this.emit();
			};
			/**
			* Reload the accepted style. The load handler also applies the side effects
			* (brand slot registration and the color variable), so both the boot refresh
			* and every page visit converge on the accepted state.
			*/
			refresh = async () => {
				const load = this.handlers?.load;
				if (load === void 0) return;
				this.state = {
					...this.state,
					busy: true,
					error: null
				};
				this.emit();
				try {
					const accepted = await load();
					this.state = {
						...this.state,
						...accepted,
						busy: false,
						error: null
					};
				} catch (cause) {
					this.state = {
						...this.state,
						busy: false,
						error: messageOf(cause)
					};
				}
				this.emit();
			};
			/** Persist and apply the custom-style toggle. */
			setEnabled = async (enabled) => {
				const handler = this.handlers?.setEnabled;
				if (handler === void 0) return;
				this.state = {
					...this.state,
					busy: true,
					error: null
				};
				this.emit();
				try {
					const accepted = await handler(enabled);
					this.state = {
						...this.state,
						...accepted,
						busy: false,
						error: null
					};
				} catch (cause) {
					this.state = {
						...this.state,
						busy: false,
						error: messageOf(cause)
					};
				}
				this.emit();
			};
			/** Persist and apply the hero-headline toggle. */
			setHero = async (hero) => {
				const handler = this.handlers?.setHero;
				if (handler === void 0) return;
				this.state = {
					...this.state,
					busy: true,
					error: null
				};
				this.emit();
				try {
					const accepted = await handler(hero);
					this.state = {
						...this.state,
						...accepted,
						busy: false,
						error: null
					};
				} catch (cause) {
					this.state = {
						...this.state,
						busy: false,
						error: messageOf(cause)
					};
				}
				this.emit();
			};
			/** Persist and apply the trajectory-tab toggle. */
			setTrajectoryTab = async (visible) => {
				const handler = this.handlers?.setTrajectoryTab;
				if (handler === void 0) return;
				this.state = {
					...this.state,
					busy: true,
					error: null
				};
				this.emit();
				try {
					const accepted = await handler(visible);
					this.state = {
						...this.state,
						...accepted,
						busy: false,
						error: null
					};
				} catch (cause) {
					this.state = {
						...this.state,
						busy: false,
						error: messageOf(cause)
					};
				}
				this.emit();
			};
			/** Persist and apply the session-log toggle. */
			setSessionLogButton = async (visible) => {
				const handler = this.handlers?.setSessionLogButton;
				if (handler === void 0) return;
				this.state = {
					...this.state,
					busy: true,
					error: null
				};
				this.emit();
				try {
					const accepted = await handler(visible);
					this.state = {
						...this.state,
						...accepted,
						busy: false,
						error: null
					};
				} catch (cause) {
					this.state = {
						...this.state,
						busy: false,
						error: messageOf(cause)
					};
				}
				this.emit();
			};
			/** Persist and apply the selected brand color. */
			setColor = async (color) => {
				const handler = this.handlers?.setColor;
				if (handler === void 0) return;
				this.state = {
					...this.state,
					busy: true,
					error: null
				};
				this.emit();
				try {
					const accepted = await handler(color);
					this.state = {
						...this.state,
						...accepted,
						busy: false,
						error: null
					};
				} catch (cause) {
					this.state = {
						...this.state,
						busy: false,
						error: messageOf(cause)
					};
				}
				this.emit();
			};
			emit() {
				for (const listener of this.listeners) listener();
			}
		};
		/** Single instance shared by the apply half (writer) and the section (reader). */
		const brandStyle = new BrandStyleObservable();
		//#endregion
		//#region src/client/BrandStyleSection.tsx
		/**
		* Settings page for the dsh-brand-deepseek plugin: the custom brand style.
		*
		* Registered by the client plugin body as a `settings.section` contribution,
		* so it appears as its own navigation row inside the Settings panel (bottom
		* left). The page offers:
		*  - a custom-style toggle — off restores the official default brand (the
		*    plugin stops overriding the sidebar brand slots, so the shell fallback
		*    renders);
		*  - a 会话页标题 toggle — independently switches the blank-session hero
		*    headline between the DeepSeek brand title (whale + 想从哪里开始?) and
		*    the official default (探索未至之境 + 预览版 badge);
		*  - 轨迹页签 and Session 日志按钮 toggles — show/hide two pieces of harness
		*    chrome (the trajectory view tab and the session-log header button),
		*    implemented at the DOM level only, never touching harness source;
		*  - ten selectable brand colors (the current scheme — official DeepSeek
		*    blue — is the default). Choosing one applies and persists immediately.
		*
		* The official default brand preview mirrors the current shell fallback
		* (ui-sidebar): fish mark + localized local-build label + the build-version
		* badge, stacked like the sidebar. The build version is a build-time define
		* with no client runtime API, so the preview reads the badge the sidebar
		* itself renders (custom style off leaves the fallback in the DOM); when it
		* is not present (collapsed sidebar, older harness), the preview degrades to
		* the label alone. The hero headline preview mirrors both hero states below
		* the sidebar preview.
		*
		* The page remounts on every visit (the settings shell renders only the
		* active section), so it always starts from a fresh adoption of the accepted
		* Config section. Writes go through the plugin's Config form, owned by the
		* apply half; every control is disabled while a write is in flight and when
		* the Host document cannot accept writes from this page (a non-loopback page
		* keeps no durable settings).
		*/
		/**
		* The sidebar's local-build badge format (ui-sidebar `localBuildVersion()`):
		* `<version>-<commit7>` optionally `-dirty`, e.g. `0.1.2-alpha.1-cd5ef81`.
		*/
		const LOCAL_BUILD_VERSION_PATTERN = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?-[0-9a-f]{7,40}(?:-dirty)?$/;
		/**
		* Read the build-version badge the sidebar's official default brand renders.
		* The string is the exact badge text (version + commit) shown when the
		* custom style is off; undefined when the fallback is not in the document.
		*/
		function readDefaultBuildVersion() {
			if (typeof document === "undefined") return void 0;
			const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
			for (let node = walker.nextNode(); node !== null; node = walker.nextNode()) {
				const text = (node.nodeValue ?? "").trim();
				if (LOCAL_BUILD_VERSION_PATTERN.test(text)) return text;
			}
		}
		/** Shared card chrome (design tokens with neutral fallbacks). */
		const card = {
			border: "1px solid var(--dsw-alias-border-l2, #d0d5dd)",
			borderRadius: 8,
			padding: 14,
			marginTop: 14
		};
		const title = {
			fontWeight: 600,
			fontSize: 14,
			color: "var(--dsw-alias-label-primary, #101828)"
		};
		const hint = {
			fontSize: 12,
			lineHeight: 1.5,
			color: "var(--dsw-alias-label-secondary, #475467)",
			marginTop: 4
		};
		/**
		* The shell's official default brand (ui-sidebar `.localBuildBrand` /
		* `.localBuildTitle` / `.buildVersion`): stacked label + version badge,
		* height-matched to the fish mark.
		*/
		const defaultBrandStack = {
			display: "inline-flex",
			flexDirection: "column",
			alignItems: "flex-start",
			justifyContent: "center",
			gap: 1,
			height: 24,
			whiteSpace: "nowrap"
		};
		const defaultBrandTitle = {
			fontSize: 12,
			lineHeight: "13px",
			fontWeight: 600,
			letterSpacing: 0,
			color: "var(--dsw-alias-label-primary, #101828)"
		};
		const defaultBuildVersion = {
			display: "inline-flex",
			alignItems: "center",
			height: 10,
			padding: "0 3px",
			borderRadius: 2,
			color: "var(--dsw-alias-label-primary-inverted, #ffffff)",
			background: "var(--dsw-alias-label-primary, #101828)",
			fontFamily: "var(--ds-font-family-code, ui-monospace, SFMono-Regular, Menlo, monospace)",
			fontSize: 6,
			fontWeight: 500,
			lineHeight: "10px",
			whiteSpace: "nowrap"
		};
		/** The official default hero title/badge chrome (mirrored from HeroShell). */
		const heroTitleDefault = {
			fontSize: 26,
			lineHeight: "32px",
			fontWeight: 500,
			whiteSpace: "nowrap",
			color: "var(--dsw-alias-label-primary, #101828)"
		};
		/** DeepSeek brand hero title (the toggle-on look). */
		const heroTitleBrand = {
			...heroTitleDefault,
			fontWeight: 600
		};
		/** The official 预览版 pill (mirrored from HeroShell `.previewBadge`). */
		const heroBadge = {
			padding: "1px 7px 0",
			border: "1px solid var(--dsw-alias-interactive-bg-hover, #e4e7ec)",
			borderRadius: 24,
			background: "var(--dsw-alias-state-business-tertiary, #eef2ff)",
			color: "var(--dsw-alias-label-primary-bluish, #2e4fd8)",
			fontFamily: "var(--ds-font-family-code, ui-monospace, SFMono-Regular, Menlo, monospace)",
			fontSize: 12,
			lineHeight: "18px",
			fontWeight: 500,
			whiteSpace: "nowrap"
		};
		/** Toggle track + knob, mirroring the design language's switch look. */
		function Switch({ checked, disabled, onToggle }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				type: "button",
				role: "switch",
				"aria-checked": checked,
				disabled,
				onClick: onToggle,
				style: {
					position: "relative",
					width: 40,
					height: 22,
					borderRadius: 11,
					border: "none",
					cursor: disabled ? "default" : "pointer",
					flexShrink: 0,
					background: checked ? "var(--dsw-alias-button-info-fill, #4176e6)" : "var(--dsw-alias-border-l4, #98a2b3)",
					transition: "background 0.15s ease",
					opacity: disabled ? .6 : 1
				},
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { style: {
					position: "absolute",
					top: 2,
					left: checked ? 20 : 2,
					width: 18,
					height: 18,
					borderRadius: 9,
					background: "#ffffff",
					boxShadow: "0 1px 2px rgba(0, 0, 0, 0.25)",
					transition: "left 0.15s ease"
				} })
			});
		}
		/**
		* Render the brand-style settings page.
		* @param props - composed slot props (client plugin registration).
		* @returns the page element tree.
		*/
		function BrandStyleSection({ useBrandStyle, refresh, setEnabled, setHero, setTrajectoryTab, setSessionLogButton, setColor, t }) {
			const state = useBrandStyle((value) => value);
			(0, react.useEffect)(() => {
				refresh();
			}, [refresh]);
			const [defaultVersion, setDefaultVersion] = (0, react.useState)(void 0);
			(0, react.useEffect)(() => {
				if (state.enabled) {
					setDefaultVersion(void 0);
					return;
				}
				let cancelled = false;
				const read = () => {
					if (!cancelled) setDefaultVersion(readDefaultBuildVersion());
				};
				read();
				const timer = window.setTimeout(read, 50);
				return () => {
					cancelled = true;
					window.clearTimeout(timer);
				};
			}, [state.enabled]);
			const disabled = state.busy || !state.writable;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", { children: t("settings.title") }),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: t("settings.intro") }),
				state.error !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					role: "alert",
					style: {
						color: "var(--dsw-alias-fg-danger, #c0392b)",
						marginTop: 12
					},
					children: t("settings.error").replace("{message}", state.error)
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					style: card,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						style: {
							display: "flex",
							alignItems: "flex-start",
							gap: 12
						},
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							style: { flex: 1 },
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								style: title,
								children: t("settings.enabled.label")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								style: hint,
								children: t("settings.enabled.hint")
							})]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Switch, {
							checked: state.enabled,
							disabled,
							onToggle: () => {
								setEnabled(!state.enabled);
							}
						})]
					})
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					style: card,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						style: {
							display: "flex",
							alignItems: "flex-start",
							gap: 12
						},
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							style: { flex: 1 },
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								style: title,
								children: t("settings.hero.label")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								style: hint,
								children: t("settings.hero.hint")
							})]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Switch, {
							checked: state.hero,
							disabled,
							onToggle: () => {
								setHero(!state.hero);
							}
						})]
					})
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					style: card,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						style: {
							display: "flex",
							alignItems: "flex-start",
							gap: 12
						},
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							style: { flex: 1 },
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								style: title,
								children: t("settings.trajectoryTab.label")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								style: hint,
								children: t("settings.trajectoryTab.hint")
							})]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Switch, {
							checked: state.trajectoryTab,
							disabled,
							onToggle: () => {
								setTrajectoryTab(!state.trajectoryTab);
							}
						})]
					})
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					style: card,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						style: {
							display: "flex",
							alignItems: "flex-start",
							gap: 12
						},
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							style: { flex: 1 },
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								style: title,
								children: t("settings.sessionLogButton.label")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								style: hint,
								children: t("settings.sessionLogButton.hint")
							})]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Switch, {
							checked: state.sessionLogButton,
							disabled,
							onToggle: () => {
								setSessionLogButton(!state.sessionLogButton);
							}
						})]
					})
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					style: {
						...card,
						opacity: state.enabled ? 1 : .55
					},
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							style: title,
							children: t("settings.colors.label")
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							style: hint,
							children: t("settings.colors.hint")
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							style: {
								display: "flex",
								flexWrap: "wrap",
								gap: 10,
								marginTop: 12
							},
							children: BRAND_COLORS.map((option) => {
								const selected = state.enabled && state.color.toLowerCase() === option.value.toLowerCase();
								return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
									type: "button",
									"aria-pressed": selected,
									"aria-label": t(option.nameKey),
									disabled: disabled || !state.enabled,
									onClick: () => {
										setColor(option.value);
									},
									style: {
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
										gap: 6,
										width: 64,
										padding: "6px 2px",
										border: "none",
										borderRadius: 8,
										background: selected ? "var(--dsw-alias-interactive-bg-active, rgba(0,0,0,0.06))" : "transparent",
										cursor: disabled || !state.enabled ? "default" : "pointer"
									},
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										style: {
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											width: 30,
											height: 30,
											borderRadius: "50%",
											background: option.value,
											color: "#ffffff",
											fontSize: 15,
											boxShadow: selected ? `0 0 0 2px var(--dsw-alias-bg-overlay, #ffffff), 0 0 0 4px ${option.value}` : "0 0 0 1px rgba(0, 0, 0, 0.12)"
										},
										children: selected ? "✓" : ""
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										style: {
											fontSize: 11,
											lineHeight: 1.3,
											textAlign: "center",
											color: "var(--dsw-alias-label-secondary, #475467)",
											fontWeight: selected ? 600 : 400
										},
										children: t(option.nameKey)
									})]
								}, option.id);
							})
						})
					]
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					style: card,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							style: title,
							children: t("settings.preview.label")
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							style: hint,
							children: state.enabled ? t("settings.preview.on") : t("settings.preview.off")
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							"aria-hidden": "true",
							style: {
								display: "flex",
								alignItems: "center",
								gap: 10,
								marginTop: 12,
								minHeight: 32
							},
							children: state.enabled ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(BrandMark, { size: 24 }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(BrandName, { size: 22 })] }) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.FishLogo, { size: 24 }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
								style: defaultBrandStack,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									style: defaultBrandTitle,
									children: t("brand.localBuild")
								}), defaultVersion !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									style: defaultBuildVersion,
									children: defaultVersion
								})]
							})] })
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							style: {
								marginTop: 14,
								paddingTop: 12,
								borderTop: "1px solid var(--dsw-alias-border-l2, #d0d5dd)"
							},
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								style: {
									fontSize: 12,
									lineHeight: 1.5,
									color: "var(--dsw-alias-label-secondary, #475467)",
									marginBottom: 8
								},
								children: t("settings.preview.hero.label")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								"aria-hidden": "true",
								style: {
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									gap: 10,
									minHeight: 40
								},
								children: state.hero ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(BrandMark, { size: 34 }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									style: heroTitleBrand,
									children: t("hero.title")
								})] }) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.FishLogo, { size: 34 }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										style: heroTitleDefault,
										children: t("brand.heroDefaultTitle")
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										style: heroBadge,
										children: t("brand.heroDefaultBadge")
									})
								] })
							})]
						})
					]
				})
			] });
		}
		//#endregion
		//#region src/client/visibility.ts
		/**
		* Runtime show/hide for two pieces of harness chrome the plugin controls
		* without touching harness source:
		*  - the "轨迹 / Trajectory" conversation view tab (ui-trajectory registers it
		*    as a `conversation.view` slot occupant);
		*  - the "Session 日志 / Session log" header button (ui-session-log-export's
		*    `conversation.session.header.utilities` occupant).
		*
		* Both are foreign slot occupants, and the slot registry only ever adds
		* occupants — there is no API to unregister another plugin's entry — so the
		* controller hides the rendered elements. Hiding means an inline
		* `display: none` (inline style wins over every class rule), and a
		* MutationObserver watches the document because React recreates these nodes
		* whenever the session header / view tablist remounts (session switch,
		* locale change, view change…), which would otherwise restore the element.
		*
		* Locators favor the harness CSS-module local names (`<hash>_<local>` shape,
		* stable suffix across builds) plus the localized labels as a fallback, so a
		* future harness that renames a class degrades to "the element stays
		* visible" instead of harming anything.
		*/
		/** Localized labels of the trajectory view tab (ui-trajectory `view.trajectory`). */
		const TRAJECTORY_TAB_LABELS = /* @__PURE__ */ new Set(["轨迹", "Trajectory"]);
		/** Localized labels of the session-log button (ui-session-log-export `header.action`). */
		const SESSION_LOG_LABELS = /* @__PURE__ */ new Set(["Session 日志", "Session log"]);
		/** Collapse whitespace the way rendered button text compares. */
		function normalizedTextOf(element) {
			return (element.textContent ?? "").replace(/\s+/g, " ").trim();
		}
		/** Buttons inside `scope` whose whole text is one of `labels`. */
		function buttonsByLabel(scope, labels) {
			const found = [];
			for (const candidate of scope.querySelectorAll("button")) if (labels.has(normalizedTextOf(candidate))) found.push(candidate);
			return found;
		}
		/**
		* The trajectory view tab: the one tab button inside a tablist whose label is
		* 轨迹/Trajectory. The label is the only stable hook — the tab button shares
		* its CSS-module local (`tab`) with every other view tab, and no other
		* tablist in the app (trajectory detail tabs, settings plugins tabs, cordis
		* source tabs) carries this label.
		*/
		function trajectoryTabElements() {
			const found = [];
			for (const tablist of document.querySelectorAll("[role=\"tablist\"]")) found.push(...buttonsByLabel(tablist, TRAJECTORY_TAB_LABELS));
			return found;
		}
		/**
		* The session-log header button: the `_sessionLogButton` CSS-module local is
		* unique to it (primary); the label inside the `_headerUtilities` band, then
		* the label anywhere in the document, are the renamed-class fallbacks.
		*/
		function sessionLogButtonElements() {
			const byClass = document.querySelectorAll("[class*=\"_sessionLogButton\"]");
			if (byClass.length > 0) return [...byClass];
			const found = [];
			for (const band of document.querySelectorAll("[class*=\"_headerUtilities\"]")) found.push(...buttonsByLabel(band, SESSION_LOG_LABELS));
			if (found.length === 0) found.push(...buttonsByLabel(document, SESSION_LOG_LABELS));
			return found;
		}
		/**
		* Create the controller. Before {@link VisibilityController.start} the
		* element hooks are inert; `dispose` restores the hidden elements, so a
		* plugin unload leaves the harness chrome exactly as it was.
		*/
		function createVisibilityController() {
			let observer;
			let scanScheduled = false;
			let showTrajectoryTab = true;
			let showSessionLogButton = true;
			const hidden = /* @__PURE__ */ new Set();
			const applyTo = (element, visible) => {
				const style = element.style;
				if (visible) {
					if (hidden.delete(element)) style.removeProperty("display");
				} else if (!hidden.has(element)) {
					hidden.add(element);
					style.setProperty("display", "none");
				}
			};
			const scan = () => {
				if (typeof document === "undefined") return;
				for (const element of trajectoryTabElements()) applyTo(element, showTrajectoryTab);
				for (const element of sessionLogButtonElements()) applyTo(element, showSessionLogButton);
			};
			const scheduleScan = () => {
				if (scanScheduled) return;
				scanScheduled = true;
				queueMicrotask(() => {
					scanScheduled = false;
					scan();
				});
			};
			return {
				start() {
					if (observer !== void 0 || typeof document === "undefined") return;
					observer = new MutationObserver(scheduleScan);
					observer.observe(document.documentElement, {
						childList: true,
						subtree: true
					});
					scheduleScan();
				},
				setTrajectoryTab(visible) {
					showTrajectoryTab = visible;
					scan();
				},
				setSessionLogButton(visible) {
					showSessionLogButton = visible;
					scan();
				},
				dispose() {
					observer?.disconnect();
					observer = void 0;
					for (const element of hidden) element.style.removeProperty("display");
					hidden.clear();
				}
			};
		}
		//#endregion
		//#region src/client/locales.ts
		/** Chinese (source of truth) dictionary for the dsh-brand-deepseek client plugin. */
		const zh = {
			"settings.nav": "品牌样式",
			"settings.title": "品牌样式",
			"settings.intro": "自定义 DeepSeek 品牌样式：侧边栏品牌、会话页标题（开始会话时聊天框上方）与品牌颜色均可单独控制；还可控制会话页「轨迹」页签与「Session 日志」按钮的显示。",
			"settings.enabled.label": "自定义样式",
			"settings.enabled.hint": "开启后侧边栏显示 DeepSeek 品牌并应用所选颜色；关闭后恢复官方默认品牌（DSH 本地构建）。",
			"settings.hero.label": "会话页标题",
			"settings.hero.hint": "开启后，开始新会话时聊天框上方的标题区显示 DeepSeek 品牌标题（鲸鱼图标 + 想从哪里开始?）；关闭后恢复官方默认标题（探索未至之境 + 预览版徽章）。",
			"settings.trajectoryTab.label": "轨迹页签",
			"settings.trajectoryTab.hint": "开启后，会话页顶部的「轨迹」页签可见；关闭后隐藏该页签（轨迹数据不受影响，仍随会话记录）。",
			"settings.sessionLogButton.label": "Session 日志按钮",
			"settings.sessionLogButton.hint": "开启后，会话页右上角的「Session 日志」按钮可见；关闭后隐藏该按钮（导出功能不受影响）。",
			"settings.colors.label": "品牌颜色",
			"settings.colors.hint": "共 10 种颜色可选，当前配色为默认选项。选择后立即生效并保存。",
			"settings.preview.label": "预览",
			"settings.preview.on": "自定义样式已开启，侧边栏将按所选颜色显示 DeepSeek 品牌。",
			"settings.preview.off": "自定义样式已关闭，侧边栏显示官方默认品牌（DSH 本地构建）。",
			"settings.preview.hero.label": "会话页标题（开始会话时聊天框上方）",
			"settings.error": "保存失败：{message}",
			"color.official": "官方蓝（默认）",
			"color.deep": "深蓝",
			"color.sky": "天蓝",
			"color.emerald": "翡翠绿",
			"color.teal": "青绿",
			"color.amber": "琥珀黄",
			"color.orange": "活力橙",
			"color.pink": "玫粉",
			"color.violet": "紫罗兰",
			"color.graphite": "石墨黑",
			"hero.title": "想从哪里开始?",
			"brand.heroDefaultTitle": "探索未至之境",
			"brand.heroDefaultBadge": "预览版"
		};
		/** English dictionary, checked complete against the zh key set. */
		const en = {
			"settings.nav": "Brand style",
			"settings.title": "Brand style",
			"settings.intro": "Customize the DeepSeek brand (sidebar brand, hero headline above the chat box, brand color — each independent) and control whether the conversation header shows the \"Trajectory\" view tab and the \"Session log\" button.",
			"settings.enabled.label": "Custom style",
			"settings.enabled.hint": "When on, the sidebar shows the DeepSeek brand in the chosen color; when off, the official default brand (DSH Local Build) is shown.",
			"settings.hero.label": "Hero headline",
			"settings.hero.hint": "When on, a new session shows the DeepSeek brand headline above the chat box (whale mark + \"Where should we start?\"); when off, the official default headline (Into the Unknown + Preview badge) is restored.",
			"settings.trajectoryTab.label": "Trajectory tab",
			"settings.trajectoryTab.hint": "When on, the \"Trajectory\" tab shows in the conversation header; when off, the tab is hidden (trajectory data is unaffected and still recorded with the session).",
			"settings.sessionLogButton.label": "Session log button",
			"settings.sessionLogButton.hint": "When on, the \"Session log\" button shows in the session header; when off, the button is hidden (the export feature still works).",
			"settings.colors.label": "Brand color",
			"settings.colors.hint": "10 colors to choose from; the current color scheme is the default. Changes apply and save immediately.",
			"settings.preview.label": "Preview",
			"settings.preview.on": "Custom style is on: the sidebar shows the DeepSeek brand in the selected color.",
			"settings.preview.off": "Custom style is off: the sidebar shows the official default brand (DSH Local Build).",
			"settings.preview.hero.label": "Hero headline (above the chat box when starting a session)",
			"settings.error": "Save failed: {message}",
			"color.official": "DeepSeek Blue (default)",
			"color.deep": "Deep Blue",
			"color.sky": "Sky Blue",
			"color.emerald": "Emerald",
			"color.teal": "Teal",
			"color.amber": "Amber",
			"color.orange": "Orange",
			"color.pink": "Pink",
			"color.violet": "Violet",
			"color.graphite": "Graphite",
			"hero.title": "Where should we start?",
			"brand.heroDefaultTitle": "Into the Unknown",
			"brand.heroDefaultBadge": "Preview"
		};
		//#endregion
		//#region src/settings.ts
		/**
		* Brand-style configuration shared by the plugin's two faces.
		*
		* The host half declares its Cordis Config as the volatile projection of this
		* shape, and the loader row id becomes the settings namespace; the client half
		* addresses that entry's live form through {@link BRAND_DEEPSEEK_ENTRY_ID}.
		* The module carries no imports of its own, so the client bundle inlines
		* declarations plus one string constant and nothing else.
		*/
		/** Loader entry id (`cordis.patch.yml`) owning the brand-style settings. */
		const BRAND_DEEPSEEK_ENTRY_ID = "brand-deepseek";
		//#endregion
		//#region src/client/index.ts
		const inject = [
			"slots",
			"remote",
			"configForms",
			"locale"
		];
		/** Document-root color variable the brand SVGs fill from. */
		const COLOR_VAR = "--dsh-brand-deepseek-color";
		/** DOM id of the injected hero-headline sheet. */
		const HERO_STYLE_ID = "dsh-brand-deepseek-hero-style";
		/** Read the accepted brand style; the defaults keep today's look. */
		function defaultsOf(stored) {
			const value = stored ?? {};
			return {
				enabled: typeof value.enabled === "boolean" ? value.enabled : true,
				hero: typeof value.hero === "boolean" ? value.hero : true,
				trajectoryTab: typeof value.trajectoryTab === "boolean" ? value.trajectoryTab : true,
				sessionLogButton: typeof value.sessionLogButton === "boolean" ? value.sessionLogButton : true,
				color: typeof value.color === "string" && value.color.length > 0 ? value.color : DEFAULT_BRAND_COLOR
			};
		}
		/**
		* Client plugin body: locale dictionaries, the live brand-style wiring
		* (brand slot registration + color variable), and the settings page entry.
		* @param ctx - client root context.
		*/
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register("dsh-brand-deepseek", {
				zh,
				en
			}), "dsh-brand-deepseek: dictionaries");
			const t = ctx.locale.bind("dsh-brand-deepseek");
			const form = ctx.configForms.get(BRAND_DEEPSEEK_ENTRY_ID);
			let brandDispose;
			const installBrand = () => {
				if (brandDispose !== void 0) return;
				brandDispose = ctx.slots.inject("sidebar.brand.mark", () => ctx.slots.inject("sidebar.brand.name", function* () {
					yield ctx.slots.register({ name: "sidebar.brand.mark" }, BrandMark);
					yield ctx.slots.register({ name: "sidebar.brand.name" }, BrandName);
				}));
			};
			const uninstallBrand = () => {
				brandDispose?.();
				brandDispose = void 0;
			};
			let heroDispose;
			const installHero = () => {
				if (heroDispose !== void 0) return;
				heroDispose = ctx.slots.inject("conversation.hero.brand.mark", () => ctx.slots.register({
					name: "conversation.hero.brand.mark",
					locale: "dsh-brand-deepseek"
				}, HeroHeadlineMark));
			};
			const uninstallHero = () => {
				heroDispose?.();
				heroDispose = void 0;
			};
			/** Mount/remove the sheet rewriting the hero headline row (feature on/off). */
			const applyHeroStyle = (on) => {
				if (typeof document === "undefined") return;
				const existing = document.getElementById(HERO_STYLE_ID);
				if (on) {
					if (existing === null) {
						const tag = document.createElement("style");
						tag.id = HERO_STYLE_ID;
						tag.textContent = HERO_CSS;
						document.head.appendChild(tag);
					}
				} else existing?.remove();
			};
			/** Point the brand SVGs at the selected color. */
			const applyBrandColor = (color) => {
				if (typeof document === "undefined") return;
				document.documentElement.style.setProperty(COLOR_VAR, color);
			};
			const visibility = createVisibilityController();
			visibility.start();
			/** Reconcile the runtime with one brand style (idempotent). */
			const applyState = (state) => {
				if (state.enabled) installBrand();
				else uninstallBrand();
				if (state.hero) installHero();
				else uninstallHero();
				applyHeroStyle(state.hero);
				applyBrandColor(state.color);
				visibility.setTrajectoryTab(state.trajectoryTab);
				visibility.setSessionLogButton(state.sessionLogButton);
			};
			/** Whether the Host document accepts writes from this page. */
			const writable = () => {
				const snapshot = form.getSnapshot();
				return snapshot.status === "ready" && snapshot.writable && snapshot.mode === "host";
			};
			/**
			* Adopt the section the Host last accepted (the schema defaults while none
			* stands): apply its side effects and publish it to the settings page.
			*/
			const adopt = () => {
				const state = defaultsOf(form.getSnapshot().value);
				applyState(state);
				brandStyle.adopt(state, writable());
				return state;
			};
			/**
			* Write one field. A page the Host refuses to persist never pretends to:
			* the write is skipped, and a refused write leaves the accepted section
			* standing for the page to re-adopt.
			*/
			const write = async (field, value) => {
				if (!writable()) throw new Error("this page cannot persist plugin settings");
				if (!await form.set(field, value)) throw new Error(`the Host refused the "${field}" change`);
			};
			brandStyle.handlers = {
				load: async () => adopt(),
				setEnabled: async (enabled) => {
					await write("enabled", enabled);
					return adopt();
				},
				setHero: async (hero) => {
					await write("hero", hero);
					return adopt();
				},
				setTrajectoryTab: async (trajectoryTab) => {
					await write("trajectoryTab", trajectoryTab);
					return adopt();
				},
				setSessionLogButton: async (sessionLogButton) => {
					await write("sessionLogButton", sessionLogButton);
					return adopt();
				},
				setColor: async (color) => {
					await write("color", color);
					return adopt();
				}
			};
			ctx.effect(() => form.subscribe(() => {
				adopt();
			}), "dsh-brand-deepseek: config form adoption");
			brandStyle.refresh();
			ctx.effect(() => () => {
				visibility.dispose();
				if (typeof document === "undefined") return;
				document.documentElement.style.removeProperty(COLOR_VAR);
				document.getElementById(HERO_STYLE_ID)?.remove();
			}, "dsh-brand-deepseek: style cleanup");
			const sectionInjected = {
				hooks: { brandStyle },
				refresh: () => brandStyle.refresh(),
				setEnabled: (enabled) => brandStyle.setEnabled(enabled),
				setHero: (hero) => brandStyle.setHero(hero),
				setTrajectoryTab: (visible) => brandStyle.setTrajectoryTab(visible),
				setSessionLogButton: (visible) => brandStyle.setSessionLogButton(visible),
				setColor: (color) => brandStyle.setColor(color)
			};
			ctx.slots.inject("settings.section", () => ctx.slots.register({
				name: "settings.section",
				id: "brand-deepseek",
				order: 17,
				label: () => t("settings.nav"),
				locale: "dsh-brand-deepseek",
				inject: () => sectionInjected
			}, BrandStyleSection));
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
