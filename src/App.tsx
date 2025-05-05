import RouterConfig from "./router";
import { ConfigProvider, theme } from "antd";
import zhCN from "antd/locale/zh_CN";
import { useAtom } from "jotai";
import { isDarkState } from "./models/system";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import "./utils/axios";
import "./styles/App.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});
function App() {
  const [isDark] = useAtom(isDarkState);
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <ConfigProvider
          locale={zhCN}
          theme={{
            algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
          }}
        >
          <BrowserRouter>
            <RouterConfig />
          </BrowserRouter>
        </ConfigProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
