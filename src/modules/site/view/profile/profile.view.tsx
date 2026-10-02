import { Link } from "@tanstack/react-router";
import { CalendarDays, MessageSquareText, Settings, Star, ThumbsUp, UserX } from "lucide-react";
import { Breadcrumb } from "@/modules/site/components/Breadcrumb";
import { Pagination } from "@/modules/site/components/Pagination";
import { ReviewCard, ReviewCardSkeleton } from "@/modules/site/components/ReviewCard";
import { buttonVariants } from "@/shared/components/button-variants";
import { EmptyState, ErrorState } from "@/shared/components/state";
import { formatInteger, formatMonthYear, formatNote, getInitials } from "@/shared/utils/format";
import { cn } from "@/shared/utils/utils";
import { useProfileModel } from "./profile.model";

type ProfileViewProps = ReturnType<typeof useProfileModel>;

const ProfileSkeleton = () => (
  <div className="container-page py-8 sm:py-10" aria-busy="true">
    <span role="status" className="sr-only">
      Carregando perfil…
    </span>
    <div aria-hidden="true">
      <div className="skeleton h-4 w-48" />
      <div className="mt-6 flex items-center gap-5">
        <div className="skeleton h-24 w-24 rounded-full" />
        <div className="flex-1 space-y-3">
          <div className="skeleton h-8 w-64" />
          <div className="skeleton h-4 w-40" />
        </div>
      </div>
    </div>
  </div>
);

export const ProfileView = ({
  username,
  profile,
  isOwnProfile,
  isLoadingProfile,
  isErrorProfile,
  profileError,
  refetchProfile,
  reviews,
  page,
  totalPages,
  totalElements,
  isLoadingReviews,
  isFetchingReviews,
  isErrorReviews,
  refetchReviews,
  onPageChange,
  reviewsHeadingRef,
}: ProfileViewProps) => {
  if (isLoadingProfile) return <ProfileSkeleton />;

  if (isErrorProfile) {
    return (
      <div className="container-page py-16">
        <h1 className="sr-only">Erro ao carregar o perfil</h1>
        <ErrorState message={profileError?.message} onRetry={() => refetchProfile()} />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container-page py-16">
        <EmptyState
          icon={<UserX />}
          headingLevel="h1"
          title="Perfil não encontrado"
          description={`Não existe um perfil público ativo para @${username}.`}
          action={
            <Link to="/products" className={buttonVariants()}>
              Explorar produtos
            </Link>
          }
        />
      </div>
    );
  }

  const stats = [
    { icon: <MessageSquareText />, value: formatInteger(profile.reviewsCount), label: profile.reviewsCount === 1 ? "avaliação publicada" : "avaliações publicadas" },
    { icon: <ThumbsUp />, value: formatInteger(profile.helpfulReceived), label: profile.helpfulReceived === 1 ? "marcação de útil recebida" : "marcações de útil recebidas" },
    {
      icon: <Star />,
      value: profile.averageNoteGiven != null && profile.reviewsCount > 0 ? formatNote(profile.averageNoteGiven) : "–",
      label: "nota média que dá",
    },
  ];

  return (
    <div className="container-page py-8 sm:py-10">
      <Breadcrumb items={[{ label: `Perfil de ${profile.name}` }]} />

      <section aria-labelledby="perfil-title" className="relative mt-6 overflow-hidden rounded-3xl border border-line bg-surface shadow-card">
        <div aria-hidden="true" className="h-24 bg-gradient-to-r from-brand-950 via-primary to-brand-500 sm:h-28" />
        <div className="px-5 pb-6 sm:px-8 sm:pb-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <span
                aria-hidden="true"
                className="-mt-12 flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-tint-strong font-display text-3xl font-bold text-brand-800 ring-4 ring-surface sm:-mt-14 sm:h-28 sm:w-28"
              >
                {getInitials(profile.name)}
              </span>
              <div className="sm:pt-4">
                <h1 id="perfil-title" className="text-3xl font-bold text-ink sm:text-4xl">
                  {profile.name}
                </h1>
                <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
                  <span className="font-medium text-ink-soft">@{profile.username}</span>
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays aria-hidden="true" className="h-4 w-4" />
                    Membro desde <time dateTime={profile.memberSince}>{formatMonthYear(profile.memberSince)}</time>
                  </span>
                </p>
              </div>
            </div>
            {isOwnProfile && (
              <div className="flex flex-wrap gap-2 sm:pt-5">
                <Link to="/minhas-avaliacoes" className={buttonVariants({ color: "outline", size: "sm" })}>
                  Minhas avaliações
                </Link>
                <Link to="/preferencias" className={buttonVariants({ color: "ghost", size: "sm" })}>
                  <Settings aria-hidden="true" className="h-4 w-4" />
                  Preferências
                </Link>
              </div>
            )}
          </div>

          <dl className="mt-7 grid gap-3 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3 rounded-2xl bg-canvas px-4 py-3.5">
                <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-tint text-brand-700 [&>svg]:h-5 [&>svg]:w-5">
                  {stat.icon}
                </span>
                <div className="flex flex-col">
                  <dt className="text-sm text-muted">{stat.label}</dt>
                  <dd className="order-first font-display text-2xl font-bold text-ink">{stat.value}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="perfil-avaliacoes" className="mt-12">
        <h2 id="perfil-avaliacoes" ref={reviewsHeadingRef} tabIndex={-1} className="text-2xl font-bold text-ink focus:outline-none sm:text-3xl">
          Avaliações de {profile.name.split(" ")[0]}
          {totalElements > 0 && <span className="ml-2 font-sans text-lg font-medium text-muted">({formatInteger(totalElements)})</span>}
        </h2>
        <p className="sr-only" role="status" aria-live="polite">
          {totalPages > 1 ? `Página ${page + 1} de ${totalPages}` : ""}
        </p>

        <div className="mt-6">
          {isErrorReviews ? (
            <ErrorState message="Não conseguimos carregar as avaliações." onRetry={() => refetchReviews()} />
          ) : isLoadingReviews ? (
            <div className="grid gap-5 md:grid-cols-2" aria-hidden="true">
              <ReviewCardSkeleton />
              <ReviewCardSkeleton />
            </div>
          ) : reviews.length === 0 ? (
            <EmptyState
              icon={<MessageSquareText />}
              title={isOwnProfile ? "Você ainda não publicou avaliações" : "Nenhuma avaliação publicada ainda"}
              description={isOwnProfile ? "Conte como foi sua experiência com algum produto." : undefined}
              headingLevel="h3"
              action={
                isOwnProfile ? (
                  <Link to="/products" className={buttonVariants()}>
                    Avaliar um produto
                  </Link>
                ) : undefined
              }
            />
          ) : (
            <ul aria-busy={isFetchingReviews} className={cn("grid gap-5 md:grid-cols-2", isFetchingReviews && "opacity-60")}>
              {reviews.map((review) => (
                <li key={review.id}>
                  <ReviewCard review={review} showProduct hideAuthorLink />
                </li>
              ))}
            </ul>
          )}
        </div>
        <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} label="Paginação das avaliações do perfil" className="mt-8" />
      </section>
    </div>
  );
};
