import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

const NewItems = () => {
  const [items, setItems] = useState([]);
  const [timeLeft, setTimeLeft] = useState({});

  const carouselOptions = {
    items: 4,
    margin: 15,
    loop: true,
    nav: true,
    dots: false,
    responsive: {
      0: { items: 1 },
      600: { items: 2 },
      800: { items: 3 },
      1000: { items: 4 },
    },
  };

  function getDate(expiryDate) {
    let dateString = "";
    const remainingTime = expiryDate - Date.now();
    const seconds = Math.max(Math.floor(remainingTime / 1000), 0); // Ensure it doesn't go negative
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  }

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        "https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems"
      );
      setItems(response.data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        const updatedTimeLeft = { ...prevTimeLeft };
        items.forEach((item, index) => {
          if (item.expiryDate) {
            const remainingTime = item.expiryDate - Date.now();
            if (remainingTime > 0) {
              updatedTimeLeft[index] = getDate(item.expiryDate);
            } else {
              updatedTimeLeft[index] = "Expired";
            }
          }
        });
        return updatedTimeLeft;
      });
    }, 1000);
    console.log("updated");
    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, [items]);

  return (
    <section id="section-items" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>New Items</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>

          <OwlCarousel
            key={items.length} // Force re-render
            className="owl-theme"
            {...carouselOptions}
          >
            {items.map((item, index) => (
              <div key={index} className="nft__item">
                <div className="author_list_pp">
                  <Link
                    to="/author"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title="Creator: Monica Lucas"
                  >
                    <img className="lazy" src={item.authorImage} alt="" />
                    <i className="fa fa-check"></i>
                  </Link>
                </div>
                {item.expiryDate && (
                  <div className="de_countdown">{timeLeft[index]}</div>
                )}

                <div className="nft__item_wrap">
                  <div className="nft__item_extra">
                    <div className="nft__item_buttons">
                      <button>Buy Now</button>
                      <div className="nft__item_share">
                        <h4>Share</h4>
                        <a href="" target="_blank" rel="noreferrer">
                          <i className="fa fa-facebook fa-lg"></i>
                        </a>
                        <a href="" target="_blank" rel="noreferrer">
                          <i className="fa fa-twitter fa-lg"></i>
                        </a>
                        <a href="">
                          <i className="fa fa-envelope fa-lg"></i>
                        </a>
                      </div>
                    </div>
                  </div>

                  <Link to="/item-details">
                    <img
                      src={item.nftImage}
                      className="lazy nft__item_preview"
                      alt=""
                    />
                  </Link>
                </div>
                <div className="nft__item_info">
                  <Link to="/item-details">
                    <h4>{item.title}</h4>
                  </Link>
                  <div className="nft__item_price">{item.price} ETH</div>
                  <div className="nft__item_like">
                    <i className="fa fa-heart"></i>
                    <span>{item.likes}</span>
                  </div>
                </div>
              </div>
            ))}
          </OwlCarousel>
        </div>
      </div>
    </section>
  );
};

export default NewItems;
