// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;

  // Lógica para usuário LOGADO
  if (session) {
    // Se o usuário logado tentar acessar a página de login/registro,
    // redireciona para o painel de administração.
    if (pathname.startsWith("/acesso")) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  // Lógica para usuário NÃO LOGADO
  if (!session) {
    // Se o usuário não logado tentar acessar qualquer rota protegida
    // que comece com /admin, redireciona para a página de login.
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/acesso", req.url));
    }
  }

  // Se nenhuma das condições acima for atendida, continua a navegação normal.
  return res;
}

// Aplica o middleware a todas as rotas, exceto arquivos estáticos e de API.
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
