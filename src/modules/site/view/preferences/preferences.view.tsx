import { useId } from "react";
import { Link } from "@tanstack/react-router";
import { Bell, Mail, Monitor, Moon, Palette, Sun } from "lucide-react";
import { Breadcrumb } from "@/modules/site/components/Breadcrumb";
import { ErrorState } from "@/shared/components/state";
import { cn } from "@/shared/utils/utils";
import { usePreferencesModel } from "./preferences.model";

type PreferencesViewProps = ReturnType<typeof usePreferencesModel>;

const THEME_ICONS = { system: Monitor, light: Sun, dark: Moon } as const;

const Card = ({ icon, title, id, children }: { icon: React.ReactNode; title: string; id: string; children: React.ReactNode }) => (
  <section aria-labelledby={id} className="rounded-2xl border border-line bg-surface p-5 shadow-card sm:p-7">
    <div className="flex items-center gap-3">
      <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-xl bg-tint text-brand-700 [&>svg]:h-5 [&>svg]:w-5">
        {icon}
      </span>
      <h2 id={id} className="text-xl font-bold text-ink">
        {title}
      </h2>
    </div>
    <div className="mt-5">{children}</div>
  </section>
);

export const PreferencesView = ({
  user,
  emailNotifications,
  isLoadingPrefs,
  isErrorPrefs,
  refetchPrefs,
  onToggleEmail,
  isSaving,
  themePreference,
  resolvedTheme,
  themeOptions,
  onThemeChange,
  announcement,
}: PreferencesViewProps) => {
  const switchLabelId = useId();
  const switchDescId = useId();
  const themeName = useId();

  return (
    <div className="container-page py-8 sm:py-10">
      <Breadcrumb items={[{ label: "Preferências" }]} />
      <div className="mt-5 max-w-3xl">
        <h1 className="text-3xl font-bold text-ink sm:text-4xl">Preferências</h1>
        <p className="mt-2 text-muted">
          {user ? `${user.name.split(" ")[0]}, escolha ` : "Escolha "}como quer ser avisado e como o site aparece para você.
        </p>
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>

      <div className="mt-8 max-w-3xl space-y-6">
        <Card icon={<Mail />} title="E-mails" id="pref-emails">
          {isErrorPrefs ? (
            <ErrorState message="Não conseguimos carregar suas preferências." onRetry={() => refetchPrefs()} />
          ) : (
            <div className="flex items-start justify-between gap-6">
              <div>
                <p id={switchLabelId} className="font-semibold text-ink">
                  Receber notificações por e-mail
                </p>
                <p id={switchDescId} className="mt-1 text-sm leading-relaxed text-muted">
                  Avisamos por e-mail quando sua avaliação for ocultada pela moderação, quando a equipe responder ou quando
                  um produto que você segue receber uma avaliação nova{user?.email ? ` (enviado para ${user.email})` : ""}.
                </p>
              </div>
              {isLoadingPrefs ? (
                <span className="skeleton h-8 w-14 shrink-0 rounded-full" aria-hidden="true" />
              ) : (
                <button
                  type="button"
                  role="switch"
                  aria-checked={emailNotifications}
                  aria-labelledby={switchLabelId}
                  aria-describedby={switchDescId}
                  aria-busy={isSaving || undefined}
                  onClick={onToggleEmail}
                  className={cn(
                    "relative mt-1 inline-flex h-8 w-14 shrink-0 items-center rounded-full border-2 transition-colors",
                    emailNotifications ? "border-primary bg-primary" : "border-line-strong bg-canvas",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "inline-block h-6 w-6 rounded-full shadow-card transition-transform duration-200",
                      emailNotifications ? "translate-x-6 bg-white" : "translate-x-0.5 bg-line-strong",
                    )}
                  />
                  <span className="sr-only">{emailNotifications ? "Ativado" : "Desativado"}</span>
                </button>
              )}
            </div>
          )}
          <p className="mt-5 flex items-start gap-2 rounded-xl bg-canvas px-4 py-3 text-sm text-ink-soft">
            <Bell aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" />
            <span>
              As notificações continuam aparecendo no sino do site.{" "}
              <Link to="/notificacoes" className="link">
                Ver notificações
              </Link>
            </span>
          </p>
        </Card>

        <Card icon={<Palette />} title="Aparência" id="pref-tema">
          <fieldset>
            <legend className="mb-3 text-sm text-muted">
              Tema do site <span className="sr-only">(atual: {resolvedTheme === "dark" ? "escuro" : "claro"})</span>
            </legend>
            <div className="grid gap-3 sm:grid-cols-3">
              {themeOptions.map((option) => {
                const Icon = THEME_ICONS[option.value];
                const id = `${themeName}-${option.value}`;
                const checked = themePreference === option.value;
                return (
                  <div key={option.value}>
                    <input
                      id={id}
                      type="radio"
                      name={themeName}
                      value={option.value}
                      checked={checked}
                      onChange={() => onThemeChange(option.value)}
                      className="peer sr-only"
                    />
                    <label
                      htmlFor={id}
                      className={cn(
                        "flex h-full cursor-pointer flex-col gap-1 rounded-xl border-2 p-4 transition-colors",
                        "peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--focus-ring)]",
                        checked ? "border-primary bg-tint dark:border-brand-300" : "border-line hover:border-line-strong",
                      )}
                    >
                      <Icon aria-hidden="true" className="h-5 w-5 text-brand-700" />
                      <span className="font-semibold text-ink">{option.label}</span>
                      <span className="text-sm text-muted">{option.description}</span>
                    </label>
                  </div>
                );
              })}
            </div>
          </fieldset>
          <p className="mt-4 text-sm text-muted">A escolha fica salva neste navegador.</p>
        </Card>
      </div>
    </div>
  );
};
