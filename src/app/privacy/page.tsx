const PrivacyPage = () => (
  <div className="container-grid space-y-10 pb-20 pt-10 text-sm leading-relaxed text-foreground/70">
    <header className="space-y-4">
      <h1 className="text-3xl font-heading text-foreground">Privacy Policy</h1>
      <p>
        This Privacy Policy explains how Coding Ninjas Chitkara collects, uses,
        and protects personal information shared via this website, event
        registrations, and community programs. We are committed to responsible
        data practices and transparency.
      </p>
    </header>

    <section className="space-y-3">
      <h2 className="text-xl font-heading text-foreground">
        1. Information We Collect
      </h2>
      <p>
        We collect information that you voluntarily provide, such as name,
        email, portfolio links, and Discord or GitHub handles submitted through
        forms or applications. We also collect basic analytics (page views,
        device type) using privacy-friendly tooling to improve the site
        experience. We do not sell personal data.
      </p>
    </section>

    <section className="space-y-3">
      <h2 className="text-xl font-heading text-foreground">
        2. How We Use Your Information
      </h2>
      <p>
        Information is used to process event registrations, coordinate
        mentorship, respond to inquiries, share program updates, and highlight
        member achievements. We may aggregate anonymized usage data to
        understand how our community engages with different resources.
      </p>
    </section>

    <section className="space-y-3">
      <h2 className="text-xl font-heading text-foreground">
        3. Data Retention &amp; Security
      </h2>
      <p>
        We retain personal data only as long as necessary for the stated
        purposes or to meet legal obligations. Access is limited to community
        leads who require the information to run programs. Digital systems are
        protected with secure authentication and regularly reviewed access
        controls.
      </p>
    </section>

    <section className="space-y-3">
      <h2 className="text-xl font-heading text-foreground">4. Your Choices</h2>
      <p>
        You can request that we update or delete your personal information at
        any time. You may also opt out of community newsletters or updates by
        using the unsubscribe link or contacting us directly. Certain event
        registrations may require limited data to comply with campus policies.
      </p>
    </section>

    <section className="space-y-3">
      <h2 className="text-xl font-heading text-foreground">
        5. Third-Party Services
      </h2>
      <p>
        We may use trusted third-party platforms for hosting forms, analytics,
        or communications. These services are required to handle data according
        to their own privacy practices and applicable laws. We do not share
        personal data with advertisers.
      </p>
    </section>

    <section className="space-y-3">
      <h2 className="text-xl font-heading text-foreground">6. Contact</h2>
      <p>
        For questions about this policy or to exercise your data rights, email{" "}
        <a
          href="mailto:Cn.cuiet@chitkara.edu.in"
          className="text-primary"
        >
          Cn.cuiet@chitkara.edu.in
        </a>
        . We strive to respond within three business days.
      </p>
      <p className="text-xs uppercase tracking-[0.3em] text-foreground/50">
        Last updated: {new Date().getFullYear()}
      </p>
    </section>
  </div>
);

export default PrivacyPage;
