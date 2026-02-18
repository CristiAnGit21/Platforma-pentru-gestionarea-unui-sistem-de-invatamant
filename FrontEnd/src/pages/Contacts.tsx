import { useState, useEffect } from "react";
import {
    MapPin, Phone, Mail, Globe, Clock, ExternalLink,
    Building2, Users, GraduationCap, Github, Linkedin,
} from "lucide-react";

// ── Responsive hook ───────────────────────────────────────────────────────────
const useBreakpoint = () => {
    const [width, setWidth] = useState(window.innerWidth);
    useEffect(() => {
        const handler = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handler);
        return () => window.removeEventListener("resize", handler);
    }, []);
    return {
        isMobile: width < 640,
        isTablet: width >= 640 && width < 1024,
        isDesktop: width >= 1024,
    };
};

// ── Data ──────────────────────────────────────────────────────────────────────
const DEPARTMENTS = [
    { label: "Oficiul Rectorului",  phone: "+373 22 23-78-61", fax: "+373 22 23-85-04", email: "rectorat@adm.utm.md" },
    { label: "Secretariat",         phone: "+373 22 23-54-41", fax: "+373 22 23-54-41", email: "secretariat@adm.utm.md" },
    { label: "Comisia de Admitere", phone: "+373 78 83 90 49", fax: "+373 22 23-51-85", email: "admiterea@adm.utm.md" },
];

const STATS = [
    { label: "An fondare",  value: "1964"    },
    { label: "Facultăți",   value: "11"      },
    { label: "Specialități",value: "80+"     },
    { label: "Absolvenți",  value: "78 000+" },
];

const TEAM = [
    { name: "Prenume Nume", role: "Frontend Developer", email: "prenume@student.utm.md", avatar: "PN", color: "#7c3aed" },
    { name: "Prenume Nume", role: "Backend Developer",  email: "prenume@student.utm.md", avatar: "PN", color: "#2563eb" },
    { name: "Prenume Nume", role: "UI/UX Designer",     email: "prenume@student.utm.md", avatar: "PN", color: "#d97706" },
];

const card: React.CSSProperties = {
    background: "#fff",
    borderRadius: 16,
    padding: 20,
    border: "1px solid #f1f5f9",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
};

const iconBox: React.CSSProperties = {
    display: "inline-flex",
    padding: 7,
    borderRadius: 10,
    background: "#ede9fe",
    color: "#7c3aed",
    flexShrink: 0,
};


const ContactRow = ({ icon, value, href }: { icon: React.ReactNode; value: string; href?: string }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ color: "#94a3b8", flexShrink: 0 }}>{icon}</span>
        {href ? (
            <a href={href} style={{ fontSize: 12.5, color: "#7c3aed", textDecoration: "none", fontWeight: 500, wordBreak: "break-all" }}>{value}</a>
        ) : (
            <span style={{ fontSize: 12.5, color: "#64748b", wordBreak: "break-all" }}>{value}</span>
        )}
    </div>
);

const AboutRow = ({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href?: string }) => (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "8px 0", borderBottom: "1px solid #f8fafc", flexWrap: "wrap" }}>
        <span style={{ color: "#c4b5fd", flexShrink: 0, marginTop: 2 }}>{icon}</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", minWidth: 72, marginTop: 2 }}>{label}</span>
        {href ? (
            <a href={href} style={{ fontSize: 13, color: "#7c3aed", textDecoration: "none", fontWeight: 500, wordBreak: "break-all" }}>{value}</a>
        ) : (
            <span style={{ fontSize: 13, color: "#475569", fontWeight: 500, wordBreak: "break-all" }}>{value}</span>
        )}
    </div>
);


const ContactPage = () => {
    const [activeTab, setActiveTab] = useState<"utm" | "team">("utm");
    const { isMobile, isTablet } = useBreakpoint();

    
    const statsColumns = isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)";
    const mapContactColumns = isMobile || isTablet ? "1fr" : "1fr 1fr";
    const aboutColumns = isMobile ? "1fr" : "1fr 1fr";
    const teamColumns = isMobile ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(3, 1fr)";

    return (
        <div style={{ fontFamily: "'Inter', system-ui, sans-serif", color: "#1e293b" }}>

           
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, margin: 0 }}>Contacte</h1>
                <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 4, marginBottom: 0 }}>
                    Universitatea Tehnică a Moldovei · Echipa de dezvoltare
                </p>
            </div>

            
            <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
                {[
                    { key: "utm",  label: "Universitate",   icon: Building2 },
                    { key: "team", label: "Echipa Noastră", icon: Users },
                ].map(({ key, label, icon: Icon }) => (
                    <button key={key} onClick={() => setActiveTab(key as "utm" | "team")} style={{
                        display: "flex", alignItems: "center", gap: 6,
                        padding: "8px 16px", borderRadius: 10, border: "none",
                        fontSize: 13, fontWeight: 600, cursor: "pointer",
                        background: activeTab === key ? "#7c3aed" : "#f1f5f9",
                        color: activeTab === key ? "#fff" : "#64748b",
                        boxShadow: activeTab === key ? "0 2px 8px rgba(124,58,237,0.25)" : "none",
                    }}>
                        <Icon size={14} />{label}
                    </button>
                ))}
            </div>

            {activeTab === "utm" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                    {/* Stats */}
                    <div style={{ display: "grid", gridTemplateColumns: statsColumns, gap: 12 }}>
                        {STATS.map((s) => (
                            <div key={s.label} style={card}>
                                <p style={{ fontSize: isMobile ? 20 : 24, fontWeight: 800, color: "#7c3aed", margin: 0 }}>{s.value}</p>
                                <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 4, marginBottom: 0 }}>{s.label}</p>
                            </div>
                        ))}
                    </div>

      
                    <div style={{ display: "grid", gridTemplateColumns: mapContactColumns, gap: 16 }}>

                        {/* Map */}
                        <div style={{ ...card, padding: 0, overflow: "hidden" }}>
                            <div style={{ padding: "18px 18px 12px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                    <span style={iconBox}><MapPin size={16} /></span>
                                    <span style={{ fontWeight: 700, fontSize: 15 }}>Sediul Principal</span>
                                </div>
                                <p style={{ fontSize: 12, color: "#94a3b8", margin: 0, paddingLeft: 34 }}>
                                    Bd. Ștefan cel Mare și Sfânt, 168, MD-2004, Chișinău
                                </p>
                            </div>
                            <iframe
                                title="Harta UTM"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2719.847059917938!2d28.832958!3d47.022713!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40c97c3628b769a1%3A0x7e1b7349fe9e7cd2!2sUniversitatea%20Tehnic%C4%83%20a%20Moldovei!5e0!3m2!1sro!2smd!4v1700000000000!5m2!1sro!2smd"
                                width="100%"
                                height={isMobile ? "180" : "210"}
                                style={{ border: 0, display: "block" }}
                                allowFullScreen loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                            <div style={{ padding: "12px 18px 18px" }}>
                                <a
                                    href="https://maps.google.com/?q=Universitatea+Tehnica+a+Moldovei+Chisinau"
                                    target="_blank" rel="noreferrer"
                                    style={{
                                        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                                        padding: "9px 0", borderRadius: 10, border: "1px solid #e2e8f0",
                                        fontSize: 13, fontWeight: 600, color: "#64748b",
                                        textDecoration: "none", background: "#f8fafc",
                                    }}
                                >
                                    <ExternalLink size={13} />Deschide în Google Maps
                                </a>
                            </div>
                        </div>

                        {/* Contacts */}
                        <div style={card}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                                <span style={iconBox}><Phone size={16} /></span>
                                <div>
                                    <p style={{ fontWeight: 700, fontSize: 15, margin: 0 }}>Contacte Oficiale</p>
                                    <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>Sursă: utm.md</p>
                                </div>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                {DEPARTMENTS.map((dept) => (
                                    <div key={dept.label} style={{ background: "#f8fafc", borderRadius: 12, padding: "12px 14px", border: "1px solid #f1f5f9" }}>
                                        <p style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 8px" }}>
                                            {dept.label}
                                        </p>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                                            <ContactRow icon={<Phone size={11} />} value={dept.phone} href={`tel:${dept.phone}`} />
                                            <ContactRow icon={<Phone size={11} />} value={`Fax: ${dept.fax}`} />
                                            <ContactRow icon={<Mail size={11} />}  value={dept.email} href={`mailto:${dept.email}`} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* About */}
                    <div style={card}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                            <span style={iconBox}><GraduationCap size={16} /></span>
                            <p style={{ fontWeight: 700, fontSize: 15, margin: 0 }}>Despre Universitate</p>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: aboutColumns, gap: 20 }}>
                            <p style={{ fontSize: 13.5, color: "#475569", lineHeight: 1.75, margin: 0 }}>
                                Universitatea Tehnică a Moldovei este singura instituție de învățământ superior tehnic acreditată de stat din Republica Moldova, fondată în <strong>1964</strong>. A pregătit peste <strong>78 000 de specialiști</strong> și a lansat <strong>TUMnanoSAT</strong> — primul satelit din Republica Moldova — pe 15 iulie 2022.
                            </p>
                            <div>
                                <AboutRow icon={<MapPin size={13} />} label="Adresă"  value="Bd. Ștefan cel Mare 168, Chișinău" />
                                <AboutRow icon={<Globe   size={13} />} label="Website" value="utm.md" href="https://utm.md" />
                                <AboutRow icon={<Clock   size={13} />} label="Program" value="Luni – Vineri, 08:00 – 17:00" />
                                <AboutRow icon={<Mail    size={13} />} label="Email"   value="rectorat@adm.utm.md" href="mailto:rectorat@adm.utm.md" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "team" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div style={card}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                            <span style={iconBox}><Users size={16} /></span>
                            <p style={{ fontWeight: 700, fontSize: 15, margin: 0 }}>Echipa de Dezvoltare</p>
                        </div>
                        <p style={{ fontSize: 13, color: "#94a3b8", margin: "4px 0 20px", paddingLeft: 34 }}>
                            Studenți ai Universității Tehnice a Moldovei · Actualizează cu datele reale
                        </p>

                        <div style={{ display: "grid", gridTemplateColumns: teamColumns, gap: 14 }}>
                            {TEAM.map((member, idx) => (
                                <div key={idx} style={{ borderRadius: 14, border: "1px solid #f1f5f9", overflow: "hidden" }}>
                                    <div style={{ background: member.color, padding: "22px 0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <div style={{
                                            width: 52, height: 52, borderRadius: "50%",
                                            background: "rgba(255,255,255,0.25)",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            color: "#fff", fontWeight: 800, fontSize: 17,
                                        }}>
                                            {member.avatar}
                                        </div>
                                    </div>
                                    <div style={{ padding: 14 }}>
                                        <p style={{ fontWeight: 700, fontSize: 14, margin: 0 }}>{member.name}</p>
                                        <p style={{ fontSize: 12, color: "#94a3b8", margin: "2px 0 10px" }}>{member.role}</p>
                                        <a href={`mailto:${member.email}`} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#64748b", textDecoration: "none", marginBottom: 12, wordBreak: "break-all" }}>
                                            <Mail size={11} style={{ flexShrink: 0 }} />{member.email}
                                        </a>
                                        <div style={{ display: "flex", gap: 6 }}>
                                            <a href="#" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, padding: "6px 0", borderRadius: 8, fontSize: 12, fontWeight: 600, textDecoration: "none", background: "#f1f5f9", color: "#334155" }}>
                                                <Github size={12} />GitHub
                                            </a>
                                            <a href="#" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, padding: "6px 0", borderRadius: 8, fontSize: 12, fontWeight: 600, textDecoration: "none", background: "#eff6ff", color: "#2563eb" }}>
                                                <Linkedin size={12} />LinkedIn
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Project card */}
                    <div style={{ borderRadius: 16, padding: isMobile ? 18 : 24, background: "linear-gradient(135deg, #7c3aed, #2563eb)", color: "#fff" }}>
                        <p style={{ fontSize: 16, fontWeight: 700, margin: "0 0 8px" }}>Despre Proiect</p>
                        <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.8)", lineHeight: 1.6, margin: "0 0 16px" }}>
                            Proiect academic dezvoltat la Universitatea Tehnică a Moldovei. Actualizează cu descrierea, cursul și scopul proiectului tău.
                        </p>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            {["React", "TypeScript", "Tailwind CSS"].map((tech) => (
                                <span key={tech} style={{ padding: "4px 12px", borderRadius: 999, background: "rgba(255,255,255,0.2)", fontSize: 12, fontWeight: 600 }}>
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactPage;