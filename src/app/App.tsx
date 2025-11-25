import { cnMixScrollBar } from "@consta/uikit/MixScrollBar";
import { Responses500 } from "@consta/uikit/Responses500";
import { Theme } from "@consta/uikit/Theme";
import { useQuery } from "@tanstack/react-query";
import { getTheme, themeStore } from "features/ToggleTheme";
import { observer } from "mobx-react-lite";
import { BrowserRouter } from "react-router-dom";
import { configureApp } from "shared/appConfiguration";
import { Loader } from "shared/ui/Loader";
import { AppRoutes } from "./AppRoutes";
import "./globalStyles.css";
import "./transitions/index.css";
import { FullscreenContainer } from "shared/ui/FullscreenContainer";

export const App = observer(() => {
	const { isLoading, isSuccess, isError, error } = useQuery({
		queryKey: ["configureApp"],
		queryFn: configureApp,
	});

	return (
		<Theme preset={getTheme(themeStore.theme)} className={cnMixScrollBar()}>
			<FullscreenContainer>
				{isLoading && <Loader />}
				{isError && <Responses500 title={error.message} actions={[]} size="m" />}
				{isSuccess && (
					<BrowserRouter>
						<AppRoutes />
					</BrowserRouter>
				)}
			</FullscreenContainer>
		</Theme>
	);
});
