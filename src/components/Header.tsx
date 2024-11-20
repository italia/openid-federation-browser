import info from "../../package.json";
import { GithubForkAtom } from "../atoms/GitHubFork";
import { VersionAtom } from "../atoms/Version";
import { BrandAtom } from "../atoms/Brand";

export function Header() {
  return (
    <div className="it-header-wrapper">
      <div className="it-nav-wrapper">
        <div className="it-header-center-wrapper">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="it-header-center-content-wrapper">
                  <BrandAtom />
                  <div className="it-right-zone">
                    <div className="row">
                      <div className="col-8"><GithubForkAtom githubPageUrl="https://github.com/italia/openid-federation-browser" /></div>
                      <div className="col-6"><VersionAtom version={info.version} /></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}