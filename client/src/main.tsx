import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { ToastContainer, Bounce } from "react-toastify";
import { store } from "./store/store.ts";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<GoogleOAuthProvider clientId="368878167995-74idlf5id25qujhf12e2jouanenf2aie.apps.googleusercontent.com">
			<Provider store={store}>
				<BrowserRouter>
					<App />
					<ToastContainer
						position="top-right"
						autoClose={2000}
						hideProgressBar={false}
						newestOnTop={false}
						closeOnClick={false}
						rtl={false}
						pauseOnFocusLoss
						draggable
						pauseOnHover
						theme="dark"
						transition={Bounce}
					/>
				</BrowserRouter>
			</Provider>
		</GoogleOAuthProvider>
	</StrictMode>
);
