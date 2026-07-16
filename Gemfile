source "https://rubygems.org"

# Deployed via a GitHub Actions workflow (actions/jekyll-build-pages), not
# GitHub's legacy auto-builder, so we track current Jekyll directly instead
# of the "github-pages" gem (which pins Jekyll 3.9 / Liquid 4.0.3 and cannot
# run on modern Ruby at all — see PICKUP_AND_GO.md).
gem "jekyll", "~> 4.4"

# Jekyll 4.x still assumes these are stdlib; Ruby 3.4+ unbundled them.
gem "csv"
gem "base64"
gem "logger"
gem "bigdecimal"
gem "webrick" # required by `jekyll serve`

group :jekyll_plugins do
  gem "jekyll-seo-tag"
  gem "jekyll-sitemap"
end
