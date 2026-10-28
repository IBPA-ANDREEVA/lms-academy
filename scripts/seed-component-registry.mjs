// One-time, non-overwriting discovery from the local approved planning records.
import { mkdir, writeFile, readdir, rm } from "node:fs/promises";
import { registryRuntime } from "./component-registry-runtime.mjs";
const rt = await registryRuntime();
try {
  const root = "docs/design/components/registry";
  await mkdir(root, { recursive: true });
  if ((await readdir(root)).length)
    throw new Error(
      "Registry already exists; never overwrite human edits with a seed.",
    );
  const { sources } = await rt.store.readSources();
  const approved = sources.filter((s) => s.approved);
  const records = new Map();
  function candidate(
    key,
    name,
    category,
    owner,
    purpose,
    s,
    priority = "P1",
    variants = "",
  ) {
    let c = records.get(key);
    if (!c) {
      c = {
        schemaVersion: 1,
        id: key,
        revision: 1,
        definition: {
          ...rt.model.emptyDefinition(name),
          category,
          ownership: owner,
          purpose,
          description: purpose,
          implementationPath:
            owner === "ui"
              ? `src/components/ui/${key}.tsx`
              : `src/features/${owner}/${key}.tsx`,
          priority,
          variants,
          implementationNotes:
            "Planning candidate only. No production implementation or visual approval. Read exact approved source records and their unresolved policy IDs before implementation. Variants share presentation only; authorization stays in owning domains.",
        },
        definitionStatus: "draft",
        definitionApproval: null,
        visualStatus: "no-reference",
        visualApproval: null,
        implementationStatus: "not-started",
        primaryReferenceId: null,
        references: [],
        archived: false,
        history: [],
      };
      records.set(key, c);
    }
    if (!c.definition.usages.some((u) => u.sectionId === s.sectionId))
      c.definition.usages.push({
        pageId: s.pageId,
        sectionId: s.sectionId,
        sourceRevision: s.revision,
        reason: purpose,
      });
    return c;
  }
  const auth = new Set([
    "login",
    "register",
    "verify-email",
    "forgot-password",
    "reset-password",
  ]);
  const legal = new Set(["offer", "privacy", "refunds", "license-disclaimer"]);
  const detail = new Set(["course-detail", "mini-detail"]);
  const unique = {
    "home--hero": [
      "home-hero",
      "HomeHero",
      "public-home",
      "Compose the statement-first home opening; one permitted technique photograph and one catalog action.",
    ],
    "home--1108ea45-8560-4667-8d7d-2b8f9db640d2": [
      "academy-story",
      "AcademyStory",
      "public-home",
      "Present verified academy purpose; content and visual composition still need approval.",
    ],
    "home--50d42603-3d44-43f5-9a61-29ee82f5948b": [
      "founder-story",
      "FounderStory",
      "public-home",
      "Present the real founder and history without invented credentials.",
    ],
    "home--d75962b8-69c3-4010-92d2-6e7f8d7806f9": [
      "contact-request",
      "ContactRequest",
      "public-home",
      "Plan the locally approved contact section; destination, fields, privacy, delivery and abuse policy remain unresolved.",
    ],
    "home--learning-explanation": [
      "learning-explanation",
      "LearningExplanation",
      "public-home",
      "Explain learning statically if included; no interactive preview is approved.",
    ],
    "cart--lines": [
      "cart-lines",
      "CartLines",
      "commerce",
      "Review selected products and remove lines without inventing quantities.",
    ],
    "cart--upgrade": [
      "package-upgrade",
      "PackageUpgrade",
      "commerce",
      "Present a Phase 2 package alternative and explicit consent; never replace automatically.",
    ],
    "cart--promo": [
      "promo-entry",
      "PromoEntry",
      "commerce",
      "Apply a Phase 2 promo code using authoritative eligibility and limits.",
    ],
    "checkout--order": [
      "checkout-order",
      "CheckoutOrder",
      "commerce",
      "Show selected order lines and a return to cart; not an editable cart clone.",
    ],
    "checkout--buyer": [
      "buyer-details",
      "BuyerDetails",
      "commerce",
      "Collect approved buyer fields with optional sign-in and safe continuation.",
    ],
    "checkout--consents": [
      "checkout-consents",
      "CheckoutConsents",
      "commerce",
      "Present approved versioned legal agreements; no invented fourth checkbox.",
    ],
    "checkout--payment": [
      "payment-attempt",
      "PaymentAttempt",
      "commerce",
      "Present authoritative processing/error/cancel states without duplicate payment on unknown outcomes.",
    ],
    "checkout-result--status": [
      "purchase-result",
      "PurchaseResult",
      "commerce",
      "Display authorized payment and access-preparation state; URL parameters are not proof.",
    ],
    "checkout-result--summary": [
      "order-receipt",
      "OrderReceipt",
      "commerce",
      "Display permitted order details and a safe receipt link after authorization.",
    ],
    "checkout-result--next": [
      "purchase-next-action",
      "PurchaseNextAction",
      "commerce",
      "Choose safe next action from server status; activation, learning, refresh or permitted retry.",
    ],
    "checkout-result--delivery": [
      "purchase-delivery-help",
      "PurchaseDeliveryHelp",
      "commerce",
      "Explain receipt delivery and recovery without encouraging duplicate purchase.",
    ],
    "packages--configuration": [
      "package-configuration",
      "PackageConfiguration",
      "catalog",
      "Choose only approved Phase 2 package templates and directions.",
    ],
    "package-detail--included": [
      "package-contents",
      "PackageContents",
      "catalog",
      "Describe actual included courses and canonical detail links.",
    ],
    "certificate-verification--status": [
      "certificate-status",
      "CertificateStatus",
      "certificates",
      "Distinguish valid, revoked, missing and service error; Phase 3 only.",
    ],
    "certificate-verification--issuance": [
      "certificate-issuance",
      "CertificateIssuance",
      "certificates",
      "Show issuance data only after privacy policy approval; no email, homework or public PDF.",
    ],
    "certificate-verification--disclaimer": [
      "certificate-disclaimer",
      "CertificateDisclaimer",
      "certificates",
      "Present approved limits of certificate purpose and permitted links.",
    ],
    "role-context--context": [
      "role-context",
      "RoleContext",
      "identity",
      "Show current authorized task context; proposed inline surface, not a new public route.",
    ],
    "role-context--choice": [
      "role-choice",
      "RoleChoice",
      "identity",
      "Choose among assigned roles only; default and activation policy remain unresolved.",
    ],
    "login--social": [
      "social-sign-in",
      "SocialSignIn",
      "identity",
      "Plan Phase 3 provider entry after account-linking policy; no provider implementation now.",
    ],
  };
  for (const s of approved) {
    const suffix = s.sectionId.split("--")[1];
    let c;
    if (unique[s.sectionId]) {
      const [key, name, owner, purpose] = unique[s.sectionId];
      c = candidate(key, name, "section", owner, purpose, s);
    } else if (suffix === "navigation")
      c = auth.has(s.pageId)
        ? candidate(
            "auth-context",
            "AuthContext",
            "shared",
            "public-shell",
            "Orient focused account flows and preserve safe continuation.",
            s,
            "P1",
          )
        : candidate(
            "public-header",
            "PublicHeader",
            "shared",
            "public-shell",
            "Expose only phase-valid public navigation and current context.",
            s,
            "P0",
            "Public discovery; focused commerce/legal context. Confirm actual shared anatomy before extracting variants.",
          );
    else if (suffix === "legal-navigation")
      c = candidate(
        "public-footer",
        "PublicFooter",
        "shared",
        "public-shell",
        "Keep approved legal documents and permitted onward navigation available.",
        s,
        "P0",
      );
    else if (auth.has(s.pageId)) {
      if (suffix === "instruction")
        c = candidate(
          "auth-instruction",
          "AuthInstruction",
          "shared",
          "identity",
          "Explain the current account task without conflating its security policy.",
          s,
        );
      else if (suffix === "recovery")
        c = candidate(
          "auth-related-actions",
          "AuthRelatedActions",
          "feature",
          "identity",
          "Offer context-valid login/recovery links with an allowlisted internal continuation.",
          s,
        );
      else
        c = candidate(
          `${s.pageId}-form`,
          s.pageId
            .split("-")
            .map((w) => w[0].toUpperCase() + w.slice(1))
            .join("") + "Form",
          "feature",
          "identity",
          s.purpose,
          s,
          "P1",
          "Independent workflow; do not merge verification, reset and registration policies into one generic form.",
        );
    } else if (legal.has(s.pageId))
      c = candidate(
        `legal-${suffix}`,
        {
          identity: "LegalDocumentIdentity",
          article: "LegalArticle",
          return: "LegalReturnLinks",
        }[suffix],
        "shared",
        "legal-content",
        {
          identity: "Identify approved issuer, version and date.",
          article:
            "Render approved legal content without inventing policy or consent.",
          return:
            "Offer related documents and safe return to checkout or catalog.",
        }[suffix],
        s,
      );
    else if (detail.has(s.pageId))
      c = candidate(
        {
          facts: "course-facts",
          trainer: "trainer-profile",
          outcomes: "course-conditions",
          curriculum: "public-curriculum",
          preview: "public-preview",
          reviews: "moderated-reviews",
          purchase: "course-purchase",
        }[suffix],
        {
          facts: "CourseFacts",
          trainer: "TrainerProfile",
          outcomes: "CourseConditions",
          curriculum: "PublicCurriculum",
          preview: "PublicPreview",
          reviews: "ModeratedReviews",
          purchase: "CoursePurchase",
        }[suffix],
        "feature",
        suffix === "purchase" ? "commerce" : "catalog",
        s.purpose,
        s,
        suffix === "reviews" ? "P3" : "P1",
        s.pageId === "mini-detail"
          ? "Mini-course: recordings without curator/review; preserve distinct completion terms."
          : "Supported course: distinguish teacher from assigned curator and access from support.",
      );
    else if (["courses", "mini-courses"].includes(s.pageId))
      c = candidate(
        {
          intro: "catalog-intro",
          directions: "category-navigation",
          results: "catalog-results",
        }[suffix],
        {
          intro: "CatalogIntro",
          directions: "CategoryNavigation",
          results: "CatalogResults",
        }[suffix],
        "feature",
        "catalog",
        s.purpose,
        s,
        suffix === "directions" ? "P0" : "P1",
        "Course / mini-course context; do not imply curator support for mini-courses.",
      );
    else if (
      s.pageId === "home" &&
      ["course-discovery", "mini-discovery"].includes(suffix)
    )
      c = candidate(
        "home-course-selection",
        "HomeCourseSelection",
        "section",
        "public-home",
        "Compose an editorial selection of actual published products and catalog links.",
        s,
        "P1",
        "Supported courses / mini-courses; not separate card implementations.",
      );
    else if (
      (s.pageId === "home" && suffix === "packages") ||
      (s.pageId === "packages" && suffix === "offers")
    )
      c = candidate(
        "package-offers",
        "PackageOffers",
        "feature",
        "catalog",
        "Compare real published Phase 2 package contents and fixed prices.",
        s,
        "P2",
      );
    else if (s.pageId === "home" && suffix === "recommendations")
      c = candidate(
        "home-recommendations",
        "HomeRecommendations",
        "section",
        "public-home",
        "Compose real moderated reviews and permitted recommendations in Phase 3.",
        s,
        "P3",
      );
    else if (
      (s.pageId === "cart" && suffix === "summary") ||
      (s.pageId === "checkout" && suffix === "price")
    )
      c = candidate(
        "price-summary",
        "PriceSummary",
        "feature",
        "commerce",
        "Present server-authoritative totals, currency and applicable fees; no client pricing rules.",
        s,
        "P1",
        "Cart estimate / final checkout: different authority and eligibility context, common presentation only.",
      );
    else if (["packages", "package-detail"].includes(s.pageId))
      c = candidate(
        `package-${suffix}`,
        `Package${suffix[0].toUpperCase() + suffix.slice(1)}`,
        "feature",
        "catalog",
        s.purpose,
        s,
        "P2",
      );
    else
      c = candidate(
        s.pageId === "home" ? "home-usa-teaser" : `usa-${suffix}`,
        s.pageId === "home"
          ? "HomeUsaTeaser"
          : `Usa${suffix[0].toUpperCase() + suffix.slice(1)}`,
        "section",
        "catalog",
        s.purpose,
        s,
        "P3",
      );
    if (!c) throw new Error(`Unmapped ${s.sectionId}`);
    if (["results", "course-discovery", "mini-discovery"].includes(suffix))
      candidate(
        "course-card",
        "CourseCard",
        "feature",
        "catalog",
        "Summarize real course facts and valid product actions; never calculate purchase eligibility locally.",
        s,
        "P0",
        "Supported course / mini-course: data-driven differences, no curator claims for mini-courses.",
      );
    if (["directions", "configuration"].includes(suffix))
      candidate(
        "filter-controls",
        "FilterControls",
        "primitive",
        "ui",
        "Render accessible selection and reset controls; parent owns query state and catalog policy.",
        s,
        "P1",
      );
    if (
      ["form-status", "buyer", "consents", "promo"].includes(suffix) ||
      c.id === "contact-request"
    )
      candidate(
        "form-controls",
        "FormControls",
        "primitive",
        "ui",
        "Provide labeled inputs and field-level feedback; domain owns validation and consent semantics.",
        s,
        "P0",
        "Text/email/password/checkbox are primitive variants, not one universal business form.",
      );
    if (
      [
        "hero",
        "results",
        "course-discovery",
        "mini-discovery",
        "directions",
        "configuration",
        "purchase",
        "form-status",
        "buyer",
        "consents",
        "payment",
        "promo",
        "lines",
        "upgrade",
        "next",
        "recovery",
        "return",
        "choice",
        "social",
      ].includes(suffix) ||
      c.id === "contact-request"
    )
      candidate(
        "button",
        "Button",
        "primitive",
        "ui",
        "Expose a real action with accessible name and focus; parent chooses action, pending and disabled semantics.",
        s,
        "P0",
        "Primary / secondary / destructive intent; link navigation uses anchor semantics.",
      );
    candidate(
      "page-container",
      "PageContainer",
      "shared",
      "public-shell",
      "Constrain reading width and responsive gutters without owning business behavior.",
      s,
      "P0",
    );
    if (!["navigation", "legal-navigation"].includes(suffix))
      candidate(
        "section-heading",
        "SectionHeading",
        "shared",
        "public-shell",
        "Preserve semantic section hierarchy and short headings; expressive Unbounded only where scoped.",
        s,
        "P1",
        "Functional Manrope / scoped expressive display; exact sizes not approved.",
      );
  }
  for (const c of records.values()) {
    const used = c.definition.usages.map((u) =>
      approved.find((s) => s.sectionId === u.sectionId),
    );
    const combine = (key) =>
      [...new Set(used.map((s) => s[key]).filter(Boolean))].join("\n\n");
    c.definition.requiredData =
      c.definition.category === "primitive"
        ? "Accessible label, value/action and parent-supplied applicable state. Domain data remains outside the primitive."
        : combine("content");
    c.definition.interactions =
      c.definition.category === "primitive"
        ? "Keyboard and pointer activation; visible focus; no action on decorative elements; parent owns side effects."
        : combine("interactions");
    c.definition.states =
      c.definition.category === "primitive"
        ? "Default, focus-visible, hover, active, disabled with explanation; pending/error/success when applicable."
        : combine("states");
    c.definition.responsive =
      "Desktop: " +
      combine("desktop") +
      "\n\nMobile: " +
      combine("mobile") +
      "\n\nExact component-level composition is unapproved.";
    if (c.definition.category === "primitive")
      c.definition.responsive =
        "Keyboard and pointer operable at every width; minimum 44px actions; wrap long Russian labels; no horizontal overflow. Exact geometry and variants require component reference review. No inherited hero layout. 1440×900, 390×844 and 360px verification required.";
    if (["page-container", "section-heading"].includes(c.id)) {
      c.definition.requiredData =
        c.id === "page-container"
          ? "Children and explicit approved width/spacing constraints; no catalog or commerce data."
          : "Heading text and semantic level supplied by section; optional supporting copy only when required.";
      c.definition.interactions =
        "Static presentation; preserve document reading order and parent control focus.";
      c.definition.states =
        "Default, long Russian text, narrow viewport and zoom/reflow; no fabricated loading state.";
      c.definition.responsive =
        "Maintain readable gutters and heading wrapping without horizontal overflow; exact widths, type scale and display variants require scoped visual review.";
    }
    c.definition.openQuestions =
      [...new Set(used.flatMap((s) => s.issues))].join(", ") +
      "\nMISSING REFERENCE: component-level visual direction requires human review. Structure approval does not resolve product policy, source text placeholders or release gates.";
    if (c.id === "contact-request")
      c.definition.openQuestions +=
        "\nContact fields, recipient, consent, retention and anti-abuse behavior are unspecified by the local structure and must not be invented.";
    if (c.id === "home-hero")
      c.definition.implementationNotes +=
        "\nScoped existing evidence: docs/design/references/pages/home/HOME-HERO-001.md and its exact PNG; selected direction only, no mobile or component implementation approval. Do not copy reference brand, logo, photograph or fake slider. No reference is imported or approved automatically.";
    if (c.id === "catalog-results" || c.id === "home-course-selection")
      c.definition.dependencies = ["course-card"];
    if (
      c.id.endsWith("-form") ||
      [
        "buyer-details",
        "checkout-consents",
        "promo-entry",
        "contact-request",
      ].includes(c.id)
    )
      c.definition.dependencies = ["form-controls", "button"];
    if (c.id === "course-card") c.definition.dependencies = ["button"];
    if (c.id === "category-navigation")
      c.definition.dependencies = ["filter-controls"];
    if (c.id === "home-hero") c.definition.dependencies = ["button"];
    if (used.every((s) => s.phase !== "MVP"))
      c.definition.priority = used.some((s) => s.phase === "Phase 2")
        ? "P2"
        : "P3";
    await writeFile(`${root}/${c.id}.json`, JSON.stringify(c, null, 2) + "\n", {
      flag: "wx",
    });
  }
  await rt.store.syncDocs();
  console.log(
    `${records.size} draft components from ${approved.length} approved sections. No approvals created.`,
  );
} finally {
  await rm(rt.dir, { recursive: true, force: true });
}
