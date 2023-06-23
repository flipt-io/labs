import {
  faDiscord,
  faGithub,
  faMastodon,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Footer() {
  const social = [
    {
      name: "Twitter",
      href: "https://www.twitter.com/flipt_io",
      icon: faTwitter,
    },
    {
      name: "Mastadon",
      href: "https://www.hachyderm.io/@flipt",
      icon: faMastodon,
    },
    {
      name: "GitHub",
      href: "https://www.github.com/flipt-io/flipt",
      icon: faGithub,
    },
    {
      name: "Discord",
      href: "https://www.flipt.io/discord",
      icon: faDiscord,
    },
  ];

  return (
    <footer className="body-font sticky top-[100vh]">
      <div className="container mx-auto mt-8 flex flex-col items-center px-4 pt-4 sm:flex-row">
        <p className="mt-4 text-xs text-gray-400 sm:mt-0">
          <span className="block sm:inline">
            &copy; {new Date().getFullYear()} Flipt Software Inc. All rights
            reserved.
          </span>
        </p>
        <span className="mt-4 inline-flex justify-center space-x-5 sm:ml-auto sm:mt-0 sm:justify-start">
          {social.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-gray-300 hover:text-gray-400"
            >
              <span className="sr-only">{item.name}</span>
              <FontAwesomeIcon
                icon={item.icon}
                className="text-gray h-5 w-5"
                aria-hidden={true}
              />
            </a>
          ))}
        </span>
      </div>
    </footer>
  );
}
