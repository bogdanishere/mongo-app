import styles from "@/styles/Footer.module.css";
import Link from "next/link";
import { Container } from "react-bootstrap";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <Container>
        <p>&copy;{new Date().getFullYear()} Coding</p>
        <ul>
          <li>
            <Link href="/imprint">Imprint</Link>
          </li>
          <li>
            <Link href="/privacy">Privacy</Link>
          </li>
        </ul>
      </Container>
    </footer>
  );
}
