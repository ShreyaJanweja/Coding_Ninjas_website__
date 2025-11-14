const TermsPage = () => (
  <div className="container-grid space-y-10 pb-20 pt-10 text-sm leading-relaxed text-foreground/70">
    <header className="space-y-4">
      <h1 className="text-3xl font-heading text-foreground">
        Terms &amp; Conditions
      </h1>
      <p>
        Welcome to Coding Ninjas Chitkara. These Terms &amp; Conditions govern
        your access to our website, events, learning resources, and community
        programs. By using our services you agree to abide by these terms and
        the policies referenced here. If you do not agree, please refrain from
        using the site or participating in our programs.
      </p>
    </header>

    <section className="space-y-3">
      <h2 className="text-xl font-heading text-foreground">
        1. Community Standards
      </h2>
      <p>
        We are a student-led community committed to collaborative learning. You
        agree to engage with others respectfully, refrain from harassment or
        discrimination, and follow Chitkara University&apos;s code of conduct.
        Violations may result in removal from events, online platforms, or
        future programs.
      </p>
    </section>

    <section className="space-y-3">
      <h2 className="text-xl font-heading text-foreground">
        2. Intellectual Property
      </h2>
      <p>
        Unless otherwise noted, the content on this site—including curriculum,
        branding, and media—is the property of Coding Ninjas Chitkara or its
        contributors. You may not reproduce, repost, or commercially exploit any
        content without written permission. Project submissions remain owned by
        their creators, but you grant us permission to reference or showcase
        them when promoting community impact.
      </p>
    </section>

    <section className="space-y-3">
      <h2 className="text-xl font-heading text-foreground">
        3. Event Participation
      </h2>
      <p>
        Registration details must be accurate and complete. You are responsible
        for ensuring you have the rights to share any materials used in
        workshops or showcases. We may capture photos, video, or audio at events
        to document community progress; participation grants us the right to use
        this media in promotional content with proper attribution.
      </p>
    </section>

    <section className="space-y-3">
      <h2 className="text-xl font-heading text-foreground">
        4. Disclaimer &amp; Liability
      </h2>
      <p>
        All resources are provided &ldquo;as is&rdquo; for educational purposes.
        We do not guarantee particular outcomes such as internships or job
        placements. Coding Ninjas Chitkara is not liable for losses arising from
        event participation, use of third-party tools, or reliance on content
        shared by mentors or peers. You acknowledge that technology programs
        involve experimentation and assume related risks.
      </p>
    </section>

    <section className="space-y-3">
      <h2 className="text-xl font-heading text-foreground">
        5. Changes to These Terms
      </h2>
      <p>
        We may update these Terms &amp; Conditions to reflect new programs or
        legal requirements. The &ldquo;Last updated&rdquo; date will change when
        updates are published. Continued use of the site after revisions
        constitutes acceptance of the new terms.
      </p>
    </section>

    <section className="space-y-3">
      <h2 className="text-xl font-heading text-foreground">6. Contact</h2>
      <p>
        Questions about these terms can be sent to{" "}
        <a
          href="mailto:Cn.cuiet@chitkara.edu.in"
          className="text-primary"
        >
          Cn.cuiet@chitkara.edu.in
        </a>
        . We aim to reply within three business days.
      </p>
      <p className="text-xs uppercase tracking-[0.3em] text-foreground/50">
        Last updated: {new Date().getFullYear()}
      </p>
    </section>
  </div>
);

export default TermsPage;
