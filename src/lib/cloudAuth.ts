import { createLovableAuth } from "@lovable.dev/cloud-auth-js";
import { supabase } from "@/integrations/supabase/client";

const cloudAuth = createLovableAuth({
  oauthBrokerUrl: "https://oauth.lovable.app/initiate",
  supportedOAuthOrigins: ["https://oauth.lovable.app", "https://lovable.dev"],
});

type SignInOptions = {
  redirect_uri?: string;
  extraParams?: Record<string, string>;
};

export const signInWithManagedOAuth = async (
  provider: "google" | "apple" | "microsoft",
  opts?: SignInOptions,
) => {
  const result = await cloudAuth.signInWithOAuth(provider, {
    redirect_uri: opts?.redirect_uri,
    extraParams: {
      ...opts?.extraParams,
    },
  });

  if (result.redirected || result.error) {
    return result;
  }

  try {
    await supabase.auth.setSession(result.tokens);
  } catch (error) {
    return { error: error instanceof Error ? error : new Error(String(error)) };
  }

  return result;
};
