import { createClient } from "@base44/sdk";
// ✅ Đúng: Phải truyền đúng tham số appId (lấy từ URL trang quản lý của bạn: app.base44.com/apps/[APP_ID]/preview)
export const base44 = createClient({
  appId: 6afbd7d5b71daedc9e620e64
});
import { getAppParams } from "@/lib/app-params";

const { appId, token, functionsVersion, appBaseUrl } = getAppParams();

export const base44 = createClient({ appId, token: token ?? undefined, functionsVersion, serverUrl: "", appBaseUrl });
