import { useContext, useRef, useState } from "react";
import { motion, useAnimate, stagger } from "framer-motion";

import { ChallengesContext } from "../store/challenges-context.jsx";
import Modal from "./Modal.jsx";
import images from "../assets/images.js";

export default function NewChallenge({ onDone }) {
  const title = useRef();
  const description = useRef();
  const deadline = useRef();

  //scope is a ref we can add to elements, animate is a function which we can use in the code to imperatively trigger an animation'
  //we add the scope ref to the form tag because we want to specify where to look for inputs and textareas to animate. we dont want to select from the whole page
  const [scope, animate] = useAnimate();

  const [selectedImage, setSelectedImage] = useState(null);
  const { addChallenge } = useContext(ChallengesContext);

  function handleSelectImage(image) {
    setSelectedImage(image);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const challenge = {
      title: title.current.value,
      description: description.current.value,
      deadline: deadline.current.value,
      image: selectedImage,
    };

    if (
      !challenge.title.trim() ||
      !challenge.description.trim() ||
      !challenge.deadline.trim() ||
      !challenge.image
    ) {
      animate(
        "input, textarea",
        { x: [-5, -10, -5, 0, 5, 10, 5, 0] },
        { type: "spring", duration: 0.5, delay: stagger(0.05) }
      );

      animate("label", { color: "red" }, { type: "spring", duration: 0.5 });
      return;
    }

    onDone();
    addChallenge(challenge);
  }

  return (
    <Modal title="New Challenge" onClose={onDone}>
      <form id="new-challenge" onSubmit={handleSubmit} ref={scope}>
        <p>
          <label htmlFor="title">Title</label>
          <input
            ref={title}
            type="text"
            name="title"
            id="title"
            placeholder="title"
          />
        </p>

        <p>
          <label htmlFor="description">Description</label>
          <textarea
            ref={description}
            name="description"
            id="description"
            placeholder="describe your challenge"
          />
        </p>

        <p>
          <label htmlFor="deadline">Deadline</label>
          <input ref={deadline} type="date" name="deadline" id="deadline" />
        </p>

        {/* to stagger list element we have to go to the parent of li and use transition with staggerChildren set to our desired delay */}
        <motion.ul
          id="new-challenge-images"
          variants={{
            visible: { transition: { staggerChildren: 0.05 } },
          }}
        >
          {images.map((image) => (
            <motion.li
              variants={{
                hidden: { scale: 0.5, opacity: 0 },
                // we can set keyframes as values
                visible: { scale: 1, opacity: [0.8, 1.3, 1] },
              }}
              // exit={{scale: 1, opacity: 1}}
              transition={{
                type: "spring",
              }}
              key={image.alt}
              onClick={() => handleSelectImage(image)}
              className={selectedImage === image ? "selected" : undefined}
            >
              <img {...image} />
            </motion.li>
          ))}
        </motion.ul>

        <p className="new-challenge-actions">
          <button type="button" onClick={onDone}>
            Cancel
          </button>
          <button>Add Challenge</button>
        </p>
      </form>
    </Modal>
  );
}
