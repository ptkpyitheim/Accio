To deploy app from AWS instance

Clone Repo **should clone at /home/ubuntu/front-end for app to work with nginx

Deploy app

cd front-end
npm run build
sudo service nginx restart
View app at http://aws-public-dns **found on AWS console
