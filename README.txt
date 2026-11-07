Xiaoshuang Kong — independent pages

index.html     About (default homepage)
research.html  Research
projects.html  Projects
explore.html   Explore: automatically lists HTML pages in mix/
contact.html   Contact
style.css      Shared visual style
site.js        Shared top navigation and introduction; active label follows page
explore.js     Explore listing and search
assets/        Shared images
mix/           Add your HTML pages and supporting assets here

Edit each HTML file to maintain that section independently.
Edit site.js to update the common navigation or introduction once for all pages.
Upload all included files to the repository root and commit.

Local preview:
python3 scripts/build_explore.py
python3 -m http.server 8000
Open http://localhost:8000/ .

Online Explore discovers committed mix/ HTML pages automatically.
