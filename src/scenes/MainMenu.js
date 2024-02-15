import { Scene } from 'phaser';
import { socket } from '../socket';
import axios from 'axios';
import { serverURL } from '../constants';

export class MainMenu extends Scene {
  constructor() {
    super('MainMenu');
  }

  init() {
    this.roomCodeInput = document.getElementById('roomCodeInput');
  }

  create() {
    this.add.image(640, 360, 'background');
    // this.add
    //   .text(640, 460, 'Main Menu', {
    //     fontFamily: 'Arial Black',
    //     fontSize: 38,
    //     color: '#ffffff',
    //     stroke: '#000000',
    //     strokeThickness: 8,
    //     align: 'center',
    //   })
    //   .setOrigin(0.5);
    // this.input.once('pointerdown', () => {
    //   this.scene.start('Game');
    // });

    const hostGameRect = this.add
      .rectangle(300, 75, 150, 60)
      .setStrokeStyle(1, 0xffffff)
      .setInteractive();

    const hostGameText = this.add.text(0, 0, 'Host Game', {
      fontFamily: 'Sans',
      fontSize: 20,
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2,
      align: 'center',
    });

    const joinGameRect = this.add
      .rectangle(600, 75, 150, 60)
      .setStrokeStyle(1, 0xffffff)
      .setInteractive();

    const joinGameText = this.add.text(0, 0, 'Join Game', {
      fontFamily: 'Sans',
      fontSize: 20,
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2,
      align: 'center',
    });

    Phaser.Display.Align.In.Center(hostGameText, hostGameRect);
    Phaser.Display.Align.In.Center(joinGameText, joinGameRect);

    hostGameRect.on('pointerdown', this.handleHostGame.bind(this));
    joinGameRect.on('pointerdown', () => {
      this.roomCodeInput.style.display = 'inline-block';

      this.roomCodeInput.addEventListener('input', function (e) {
        this.value = this.value.replace(/[^0-9]/g, '');
      });

      console.log('join game clicked');

      const joinGameWithCodeRect = this.add
        .rectangle(640, 460, 150, 60)
        .setStrokeStyle(1, 0xffffff)
        .setInteractive();

      const joinGameWithCodeText = this.add.text(0, 0, 'Join', {
        fontFamily: 'Sans',
        fontSize: 20,
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 2,
        align: 'center',
      });
      Phaser.Display.Align.In.Center(
        joinGameWithCodeText,
        joinGameWithCodeRect
      );

      joinGameWithCodeRect.on('pointerdown', () => {
        const roomCode = this.roomCodeInput.value;

        if (roomCode.length !== 5) {
          this.handleInvalidRoomCode(joinGameWithCodeRect);
        } else {
          this.handleValidRoomCode(roomCode, this.roomCodeInput);
        }
      });
    });
  }

  handleValidRoomCode(roomCode, inputBox) {
    console.log('joining room with code:', roomCode);
    try {
      socket.connect();
      socket.on('connect', () => {
        console.log('Connected to WebSocket Server');
        socket.emit('joinRoom', { roomCode });
        socket.on('roomJoined', () => {
          console.log('Successfully joined room');

          inputBox.style.display = 'none';
          this.scene.start('Lobby', { socket, roomCode, isHost: false });
        });

        socket.on('roomJoinError', () => {
          console.log('Room does not exist');
        });
      });
    } catch (e) {
      console.log('Unable to join room:', e);
    }
  }

  handleInvalidRoomCode(rect) {
    const invalidRoomCodeText = this.add.text(
      0,
      0,
      'Please enter a valid 5-digit room code',
      {
        fontFamily: 'Sans',
        fontSize: 20,
        color: 'red',
        stroke: '#000000',
        strokeThickness: 1,
        align: 'center',
      }
    );

    Phaser.Display.Align.To.BottomCenter(invalidRoomCodeText, rect);

    setTimeout(() => {
      this.tweens.add({
        targets: invalidRoomCodeText,
        alpha: 0,
        duration: 2000,
        ease: 'Phaser.Math.Easing.Cubic.Out',
        onComplete: () => invalidRoomCodeText.destroy(),
      });
    }, 1000);
  }

  handleHostGame() {
    console.log('Host game button clicked');

    try {
      socket.connect();
      socket.on('connect', async () => {
        console.log('Connected to WebSocket Server');
        console.log('Awaiting hostRoom');
        const { data } = await axios.get(`${serverURL}/roomCode`);
        const { roomCode } = data;
        console.log('Trying to join room with code:', data);
        socket.emit('hostRoom', { roomCode });
        socket.on('roomHosted', () => {
          this.scene.start('Lobby', { socket, roomCode, isHost: true });
        });
      });
    } catch (e) {
      console.log('Unable to Host Room:', e);
    }
  }
}
