customElements.define(
  "comment-section",
  class extends HTMLElement {
    constructor() {
      super();
      const shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.innerHTML = `
      <style>
        .comments {
          color: blue;
          font-style: italic;
          width: 100%;
          padding-bottom: 5px;
        }
        textarea { width: 50%; }
        button {
          background-color: #007BFF; /* Blue */
          border: none;
          color: white;
          padding: 5px 15px;
          text-align: center;
          font-size: 15px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        button:hover {
          background-color: #0056b3;
        }
      </style>
     
      <button id="submitBtn">Добавить комментарий</button>
      <div class="comments"></div>
    `;

      shadowRoot.getElementById("submitBtn").addEventListener("click", () => {
        const comment = this.createCommentElement("Новый комментарий!");
        shadowRoot.querySelector(".comments").appendChild(comment);
      });
    }

    createCommentElement(content) {
      const comment = document.createElement("div");
      comment.className = "comment";
      const commentTemplate = document.getElementById("commentTemplate");
      const templ = commentTemplate.content.cloneNode(true);
      comment.appendChild(templ);
      
      comment.querySelector("slot").textContent = content;

      this.setupListeners(comment);
      return comment;
    }

    setupListeners(comment) {
      comment.querySelector(".like-btn").addEventListener("click", () => {
        const count = comment.querySelector(".like-count");
        count.textContent = parseInt(count.textContent) + 1;
        comment.querySelector(".like-btn").classList.add("liked");
        setTimeout(() => {
          comment.querySelector(".like-btn").classList.remove("liked");
        }, 300);
      });

      comment.querySelector(".reply-btn").addEventListener("click", () => {
        const nestedComments = comment.querySelector(".nested-comments");
        const replyTextarea = document.createElement("textarea");
        const replyButton = document.createElement("button");
        replyButton.textContent = "Отправить";
        
        nestedComments.appendChild(replyTextarea);
        nestedComments.appendChild(replyButton);

        replyButton.addEventListener("click", () => {
          const replyContent = replyTextarea.value;
          if (replyContent.trim() !== "") {
            const replyComment = this.createCommentElement(replyContent);
            nestedComments.appendChild(replyComment);
            replyTextarea.remove();
            replyButton.remove();
          } else {
            alert("Комментарий не может быть пустым");
          }
        });
      });

      comment.querySelector(".edit-btn").addEventListener("click", () => {
        const slot = comment.querySelector("slot");
        const editTextarea = document.createElement("textarea");
        editTextarea.value = slot.textContent;

        const saveButton = document.createElement("button");
        saveButton.textContent = "Сохранить";
        
        comment.querySelector(".comment-content").insertBefore(editTextarea, slot);
        comment.querySelector(".comment-content").insertBefore(saveButton, slot);

        saveButton.addEventListener("click", () => {
          if (editTextarea.value.trim() !== "") {
            slot.textContent = editTextarea.value;
            editTextarea.remove();
            saveButton.remove();
          } else {
            alert("Комментарий не может быть пустым");
          }
        });
      });

      comment.querySelector(".delete-btn").addEventListener("click", () => {
        comment.remove();
      });
    }
  }
);
